const { CompanyService,
  setCookieString, withMiddlewares,
  logwrite, RESPONSE, WARN, NTVError, ERROR } = require("ntv_module");
const { afterLogin } = require("./afterlogin");

const login = async (event, context) => {
  const requestJSON = JSON.parse(event.body);
  const query = {
    ...requestJSON,
  }
  const data = await CompanyService.login(query);
  const { token } = data.payload;
  const options = {
    domain: 'ntv-local.com',
    sameSite: 'Strict'
  }
  const cookieString = setCookieString("token-companysite", token, options);
  const response = RESPONSE(data, {
    'Set-Cookie': cookieString,
  });
  return response;
};


const createCompany = async (event, context) => {
  const requestJSON = JSON.parse(event.body);
  const query = {
    ...requestJSON,
  }
  const data = await CompanyService.createCompany(query);
  const response = RESPONSE(data);
  return response;
};

exports.login = withMiddlewares(login, [logwrite()]);
exports.createCompany = withMiddlewares(createCompany, [afterLogin('token-backoffice'), logwrite()]);