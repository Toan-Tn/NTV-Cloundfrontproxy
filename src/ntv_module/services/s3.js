const fs = require('fs');
const util = require('util');
const path = require('path');
const mime = require('mime');
const dayjs = require('dayjs');
const shortUniqueId = require('short-unique-id');
const { JsonPlaceholderReplacer } = require("json-placeholder-replacer");
const { PutCommand, GetCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { CreateJobCommand } = require("@aws-sdk/client-mediaconvert");
const { s3Client } = require("../boot/s3client");
const { ddbDocClient } = require("../boot/ddbdocclient");
const { Environment } = require('../constant/environment');
const { TableName } = require('../constant/db');
const { emcClient } = require("../boot/emcclient");
const { BussinessWarning, ValidationError } = require('../boot/errors');
const { MESSAGE } = require('../constant/message');
const { makePresignUploadSchema } = require('../schemas/validator/s3');
const ajv = require('../boot/ajv');
const { SUCCESS, WARN, ERROR } = require("../boot/payload");

class S3Service {
  static makePresignUpload = async (user, data) => {
    const validate = ajv.compile(makePresignUploadSchema);
    const valid = validate(data);
    if (!valid) {
      throw new ValidationError(MESSAGE.INVALID_INPUT);
    }
    const {
      file,
      // md5hash,
      sizefile,
    } = data;
    const uid = new shortUniqueId({ length: 16 });
    const contentType = mime.getType(file);
    const datePath = dayjs().format('YYYYMMDD');
    const idFile = uid();
    const fileName = idFile.concat('.', mime.getExtension(contentType));
    const sourcePath = `${Environment.S3_SOURCE_PATH}${user.companycode}/${datePath}/${fileName}`;
    const bucket = Environment.BUCKET_NAME;

    const bucketParams = {
      Bucket: bucket,
      Key: sourcePath,
      ContentType: contentType,
      // ContentMD5: md5hash,
      ContentLength: sizefile,
    };
    // Create the command.
    const command = new PutObjectCommand(bucketParams);
    // Create the presigned URL.
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    const paramPutItem = {
      TableName: TableName.TEMP_FILE,
      Item: {
        id: sourcePath,
        filepath: `${user.companycode}/${datePath}/${idFile}/`,
        companycode: user.companycode,
        filename: file,
        // md5hash,
        bucket,
      },
    };
    await ddbDocClient.send(new PutCommand(paramPutItem));
    return SUCCESS({
      sourcePath,
      signedUrl,
    });
  }

  static mediaConvertFile = async (data) => {
    const {
      bucket,
      object,
    } = data;
    const { key } = object;
    const { name } = bucket;
    const paramGet = {
      TableName: TableName.TEMP_FILE,
      Key: {
        id: key,
      }
    };
    const result = await ddbDocClient.send(new GetCommand(paramGet));
    const { Item: objfile } = result;
    if (!objfile) {
      throw new BussinessWarning(MESSAGE.FILE_IS_NOT_EXIST);
    }
    const {
      id,
      filepath,
      companycode,
      filename,
    } = objfile;
    const placeHolderReplacer = new JsonPlaceholderReplacer();
    const contentType = mime.getType(id);
    placeHolderReplacer.addVariableMap({
      outputPath: `s3://${name}/output/${filepath}main`,
      inputPath: `s3://${name}/${id}`,
    });
    let fileJSonConvert = '../jsontemplate/videohls.json';
    if (!contentType.startsWith('video/')) {
      fileJSonConvert = '../jsontemplate/audiohls.json';
    }
    const rawData = fs.readFileSync(path.join(__dirname, fileJSonConvert));
    const params = placeHolderReplacer.replace(JSON.parse(rawData));
    const res = await emcClient.send(new CreateJobCommand(params));
    const paramPutItem = {
      TableName: util.format(TableName.FILE_COMPANY, companycode),
      Item: {
        filepath,
        jobid: res.Job.Id,
        status: 'processing',
        bucket: name,
        filename,
      },
    };
    await ddbDocClient.send(new PutCommand(paramPutItem));
    return SUCCESS();
  }

  static mediaConvertFinished = async (data) => {
    const {
      bucket,
      object,
    } = data;
    const { key } = object;
    const { name } = bucket;
    const paramGet = {
      TableName: TableName.TEMP_FILE,
      Key: {
        id: key,
      }
    };
    const result = await ddbDocClient.send(new GetCommand(paramGet));
    const { Item: objfile } = result;
    if (!objfile) {
      throw new BussinessWarning(MESSAGE.FILE_IS_NOT_EXIST);
    }
    const {
      id,
      filepath,
      companycode,
      filename,
    } = objfile;
    const placeHolderReplacer = new JsonPlaceholderReplacer();
    const contentType = mime.getType(id);
    placeHolderReplacer.addVariableMap({
      outputPath: `s3://${name}/output/${filepath}main`,
      inputPath: `s3://${name}/${id}`,
    });
    let fileJSonConvert = '../jsontemplate/videohls.json';
    if (!contentType.startsWith('video/')) {
      fileJSonConvert = '../jsontemplate/audiohls.json';
    }
    const rawData = fs.readFileSync(path.join(__dirname, fileJSonConvert));
    const params = placeHolderReplacer.replace(JSON.parse(rawData));
    const res = await emcClient.send(new CreateJobCommand(params));
    const paramPutItem = {
      TableName: util.format(TableName.FILE_COMPANY, companycode),
      Item: {
        filepath,
        jobid: res.Job.Id,
        status: 'processing',
        bucket: name,
        filename,
      },
    };
    await ddbDocClient.send(new PutCommand(paramPutItem));
    return SUCCESS();
  }
}

module.exports = { S3Service }
