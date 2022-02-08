const { verify, BussinessWarning, getCookiesFromHeader, NTVError } = require("ntv_module");
const { NTV_LOGGER } = require("ntv_module/boot/logger");

exports.afterLogin = (tokenName) => {
  return async (event, context, next) => {
    context.callbackWaitsForEmptyEventLoop = false
    // Before Logic
    try {
      const { cookies, headers } = event;
      let token = undefined;
      if (!token && headers && headers.authorization) {
        const parts = headers.authorization.split(' ');
        if (parts.length === 2) {
          const scheme = parts[0];
          token = parts[1];
          if (!/^Bearer$/i.test(scheme)) {
            throw new BussinessWarning('Format is Authorization: Bearer [token]');
          }
        } else {
          throw new BussinessWarning('Format is Authorization: Bearer [token]');
        }
      }
      if (!token && cookies) {
        const cookiesObj = getCookiesFromHeader(cookies);
        token = cookiesObj[tokenName];
      }
      const result = verify(token);
      result.token = token
      event.user = result;
      return await next(event, context);
    } catch (err) {

      let response = {
        statusCode: 500,
        body: JSON.stringify("Internal Server Error"),
      };
      if (err instanceof NTVError) {
        response = {
          statusCode: err.code,
          body: JSON.stringify({
            message: err.message,
            payload: err.payload,
          })
        };
        NTV_LOGGER.business(response, {}, event);
      } else {
        NTV_LOGGER.exception(err, {}, event);
      }
      return response;
    }
  }
}