const adminSchema = {
  username: {
    type: 'string',
    minLength: 1,
    pattern: '^[a-zA-z0-9_\\-\\+\\.]+$',
    maxLength: 20,
  },
  password: {
    type: 'string',
    minLength: 8,
    maxLength: 16,
    pattern: '(?=.{8,})((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\\d)(?=.*[a-zA-Z])(?=.*[\\W_])|(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_])).*',
  },
  type: {
    type: 'integer',
    enum: [1, 2, 9],
  },
  name: {
    type: 'string',
    maxLength: 40,
  },
  action: {
    type: 'integer',
    enum: [0, 1],
  },
};

module.exports = {
  adminSchema,
};
