const { MediaConvertClient } = require("@aws-sdk/client-mediaconvert");
// Set the AWS Region.
const REGION = "ap-northeast-1";
//Set the MediaConvert Service Object
const emcClient = new MediaConvertClient({
  region: REGION,
  endpoint: "https://1muozxeta.mediaconvert.ap-northeast-1.amazonaws.com",
});

module.exports = { emcClient };
