/* eslint-disable max-classes-per-file */
class NTVError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NTVError';
    this.code = 999;

    Error.captureStackTrace(this, NTVError);
  }
}

class ValidationError extends NTVError {
  constructor(message, payload = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = 1;
    this.payload = payload;
    Error.captureStackTrace(this, ValidationError);
  }
}

class BussinessWarning extends NTVError {
  constructor(message, payload = {}, code = 2) {
    super(message);
    this.name = 'BussinessWarning';
    this.code = code;
    this.payload = payload;
    Error.captureStackTrace(this, ValidationError);
  }
}

class BussinessError extends NTVError {
  constructor(message, payload = {}, code = 199) {
    super(message);
    this.name = 'BussinessError';
    this.code = code;
    this.payload = payload;
    Error.captureStackTrace(this, BussinessError);
  }
}

module.exports = {
  NTVError,
  ValidationError,
  BussinessError,
  BussinessWarning,
};
