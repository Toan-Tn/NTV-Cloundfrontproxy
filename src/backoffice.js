const { AdminService,
  setCookieString, withMiddlewares,
  logwrite, RESPONSE, WARN, NTVError, NTV_LOGGER } = require("ntv_module");

const login = async (event, context) => {
  const requestJSON = JSON.parse(event.body);
  const query = {
    ...requestJSON,
  }
  const data = await AdminService.login(query);
  const { token } = data.payload;
  const options = {
    domain: 'ntv-local.com',
    sameSite: 'Strict'
  }
  const cookieString = setCookieString("token-backoffice", token, options);
  const response = RESPONSE(data, {
    'Set-Cookie': cookieString,
  });
  return response;
};

exports.login = withMiddlewares(login, [logwrite()]);