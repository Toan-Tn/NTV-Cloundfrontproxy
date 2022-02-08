const { NTVError } = require("./errors");
const { NTV_LOGGER } = require("./logger");

const withMiddlewares = (handler, middlewares = []) => (event, context, callback) => {
  const chainMiddlewares = ([firstMiddleware, ...restOfMiddlewares]) => {
    if (firstMiddleware) {
      return (e, c) => {
        try {
          return firstMiddleware(e, c, chainMiddlewares(restOfMiddlewares))
        } catch (error) {
          return Promise.reject(error)
        }
      }
    }

    return handler
  }

  chainMiddlewares(middlewares)(event, context)
    .then(result => callback(null, result))
    .catch((err) => {
      callback(err, null)
    })
}

const logwrite = () => {
  return async (event, context, next) => {
    // Before Logic
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      NTV_LOGGER.request(event);
      const response = await next(event, context);
      NTV_LOGGER.response(event, response);
      return response;
    } catch (err) {
      let response = {
        statusCode: 500,
        body: JSON.stringify("Internal Server Error"),
      };
      if (err instanceof NTVError) {
        response = {
          statusCode: 200,
          body: JSON.stringify({
            code: err.code,
            message: err.message,
            payload: err.payload,
          })
        };
        NTV_LOGGER.business(err.message, {}, event);
      } else {
        NTV_LOGGER.exception(err.stack, {}, event);
      }
      NTV_LOGGER.response(event, response);
      return response;
    }
  }
}

module.exports = { withMiddlewares, logwrite }