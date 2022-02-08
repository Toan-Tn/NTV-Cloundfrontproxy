const { S3Client } = require("@aws-sdk/client-s3");
// Set the AWS Region.
const REGION = "ap-northeast-1"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const s3Client = new S3Client({ region: REGION });
module.exports = { s3Client };
