const jwt = require('jsonwebtoken');
const { Environment } = require("../constant/environment");
const { BussinessWarning } = require('./errors');

const sign = (data) => {
  return jwt.sign(data, Environment.SECRET_KEY_JWT, { expiresIn: '7d' });
}

const verify = (token) => {
  try {
    const result = jwt.verify(token, Environment.SECRET_KEY_JWT);
    return result;
  } catch (err) {
    throw new BussinessWarning('Authentication fail', null, 401);
  }
}

module.exports = { sign, verify }
