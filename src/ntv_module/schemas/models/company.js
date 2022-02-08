const companySchema = {
  companycode: {
    type: 'string',
    minLength: 1,
    pattern: '^[a-zA-z0-9_\\-\\+\\.]+$',
    maxLength: 10,
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
};

module.exports = {
  companySchema,
};
