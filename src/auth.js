const { withMiddlewares,
  logwrite } = require("ntv_module");

const handler = (event, context) => {
  const apiKeyHeader = event.headers['x-api-key'];
  const apiKey = process.env.ApiKey;
  let isAuthorized = false;
  if (apiKeyHeader === apiKey) {
    isAuthorized = true;
  }
  const response = {
    isAuthorized,
    context,
  };
  return response;
}

exports.checkauth = withMiddlewares(handler, [logwrite()]);
