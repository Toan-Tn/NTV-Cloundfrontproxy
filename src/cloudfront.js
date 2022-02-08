const { CloudFrontService, withMiddlewares, logwrite, RESPONSE, ERROR, WARN, NTVError, NTV_LOGGER } = require("ntv_module");
const { afterLogin } = require("./afterlogin");

const makeSignedm3u8 = async (event, context) => {
  let response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
    }
  };
  const s3Key = event.pathParameters.proxy;
  const queryString = event.queryStringParameters;

  const result = await CloudFrontService.makeSignedm3u8(s3Key, queryString);
  response.body = result;
  return response;
};

const makeSigned = async (event, context) => {
  const requestJSON = JSON.parse(event.body);
  const query = {
    ...requestJSON,
  }
  const { user } = event;
  const result = await CloudFrontService.makeSigned(user, query);
  const response = RESPONSE(result);
  return response;

};

exports.makeSignedm3u8 = withMiddlewares(makeSignedm3u8, [logwrite()]);

exports.makeSigned = withMiddlewares(makeSigned, [afterLogin('token-companysite'), logwrite()]);