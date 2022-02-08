const { S3Service,
  withMiddlewares,
  logwrite, RESPONSE, WARN, NTVError, NTV_LOGGER } = require("ntv_module");
const { afterLogin } = require("./afterlogin");

const makePresignUpload = async (event, context) => {
  const requestJSON = JSON.parse(event.body);
  const query = {
    ...requestJSON,
  }
  const { user } = event;
  const data = await S3Service.makePresignUpload(user, query);
  const response = RESPONSE(data);
  return response;
}

const mediaConvertFile = async (event, context) => {
  const { s3 } = event.Records[0];
  const data = await S3Service.mediaConvertFile(s3);
  const response = RESPONSE(data);
  return response;
};

const mediaConvertFinished = async (event, context) => {
  const response = {};
  console.log(JSON.stringify(event));
  return response;
}

exports.mediaConvertFile = withMiddlewares(mediaConvertFile, [logwrite()]);
exports.mediaConvertFinished = withMiddlewares(mediaConvertFinished, [logwrite()]);
exports.makePresignUpload = withMiddlewares(makePresignUpload, [afterLogin('token-companysite'), logwrite()]);