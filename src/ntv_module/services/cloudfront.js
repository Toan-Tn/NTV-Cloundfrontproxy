const util = require('util');
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { ValidationError } = require("../boot/errors");
const { s3Client } = require("../boot/s3client");
const { getSignedUrl } = require('../boot/cloudfront');
const { SUCCESS } = require('../boot/payload');
const { TableName } = require("../constant/db");
const { ddbDocClient } = require('../boot/ddbdocclient');
const dayjs = require('../boot/dayjs');

class CloudFrontService {
  static makeSignedm3u8 = async (key, queryString) => {
    if (!/.m3u8$/.test(key)) {
      return new ValidationError('File invalid');
    }
    // Create a helper function to convert a ReadableStream to a string.
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });
    const bucket = process.env.S3Bucket;
    const rootPath = process.env.RootPath;
    const bucketParams = {
      Bucket: bucket,
      Key: `${rootPath}${key}`,
    };
    // Create the command.
    const command = new GetObjectCommand(bucketParams);
    const res = await s3Client.send(command);
    const content = await streamToString(res.Body);
    if (queryString) {
      return content.replace(/\.(cmfv|ts|aac|cmfa|m3u8)/g, '.$1'.concat('?', new URLSearchParams(queryString).toString()));
    }
    return content;
  }
  static makeSigned = async (user, data) => {
    const { filepath } = data;
    const { companycode } = user;
    const paramGet = {
      TableName: util.format(TableName.FILE_COMPANY, companycode),
      Key: {
        filepath,
      },
    };
    const result = await ddbDocClient.send(new GetCommand(paramGet));
    const { Item: file } = result;
    const urlPath = `https://${process.env.CloudFrontId}.cloudfront.net/${filepath}/*`;
    const params = {
      keyPairId: process.env.KeyPairId,
      pemPath: process.env.PemPath,
      expireTime: dayjs().add(7, 'day').unix()
    }
    const sign = getSignedUrl(urlPath, params);
    delete file.bucket;
    delete file.jobid;
    delete file.status;
    return SUCCESS({
      sign,
      file,
    }); 
  }
}

module.exports = { CloudFrontService }