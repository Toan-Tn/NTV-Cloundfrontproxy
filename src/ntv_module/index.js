const { AdminService } = require("./services/admin");
const { CompanyService } = require("./services/company");
const { CloudFrontService } = require("./services/cloudfront");
const { S3Service } = require("./services/s3");
const { withMiddlewares, logwrite } = require('./boot/withMiddlewares');
const { getCookiesFromHeader, setCookieString, } = require("./boot/cookies");
const { verify, sign } = require("./boot/jwt");
const { NTVError,
  ValidationError,
  BussinessError,
  BussinessWarning, } = require("./boot/errors");
const { RESPONSE } = require("./boot/response");
const { SUCCESS, WARN, ERROR } = require("./boot/payload");
const { NTV_LOGGER } = require("./boot/logger");

module.exports = {
  AdminService,
  CompanyService,
  CloudFrontService,
  S3Service,
  NTVError,
  ValidationError,
  BussinessError,
  BussinessWarning,
  withMiddlewares,
  logwrite,
  getCookiesFromHeader,
  setCookieString,
  verify,
  sign,
  RESPONSE,
  SUCCESS,
  WARN,
  ERROR,
  NTV_LOGGER
};