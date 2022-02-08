const { LambdaClient } = require("@aws-sdk/client-lambda");
// Set the AWS Region.
const REGION = "ap-northeast-1"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const lambdaClient = new LambdaClient({ region: REGION });
module.exports = { lambdaClient };