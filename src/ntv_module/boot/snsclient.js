const { SNSClient } = require("@aws-sdk/client-sns");
const REGION = "ap-northeast-1"; //e.g. "us-east-1"
const snsclient = new SNSClient({ region: REGION });
module.exports = {snsclient}
