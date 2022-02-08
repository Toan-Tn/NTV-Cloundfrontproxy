const userSchema = {
  companycode: {
    type: 'string',
    minLength: 1,
    pattern: '^[a-zA-z0-9_\\-\\+\\.]+$',
    maxLength: 10,
  },
  username: {
    type: 'string',
    minLength: 1,
    maxLength: 100,
  },
  password: {
    type: 'string',
    minLength: 8,
    maxLength: 16,
    pattern: '(?=.{8,})((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\\d)(?=.*[a-zA-Z])(?=.*[\\W_])|(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_])).*',
  },
  mail: {
    type: 'string',
    pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$',
    maxLength: 100,
  },
  name: {
    type: 'string',
    maxLength: 40,
  },
  type: {
    type: 'integer',
    enum: [1, 2, 9],
  },
};

module.exports = {
  userSchema,
};
