const SUCCESS = (payload = null, message = '', code = 0, type = 'info') => ({
  code,
  message,
  type,
  payload,
});
const WARN = (message, payload = null, code = 401, type = 'warning') => ({
  code,
  message,
  type,
  payload,
});
const ERROR = (message, payload = null, code = 999, type = 'error') => ({
  code,
  message,
  type,
  payload,
});

module.exports = { SUCCESS, WARN, ERROR };