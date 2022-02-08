const redactConstants = require('./constants');

const SECRETS = [
  /login_id/i,
  /last_name/i,
  /first_name/i,
  /id/i,
  ...redactConstants.KEYS,
];

module.exports = {
  SECRETS,
};
