const schema = {
  request: {
    page_index: {
      type: 'integer',
    },
  },
  response: {
    additionalProperties: false,
    type: 'object',
    required: ['code', 'message'],
    properties: {
      code: { type: 'integer', default: 0 },
      message: { type: 'string' },
      payload: {
        oneOf: [
          {
            additionalProperties: true,
            type: 'object',
          },
          {
            type: 'array',
          },
        ],
      },
    },
  },
  definitions: {
    nonEmptyString: {
      minLength: 1,
    },
  },
};

module.exports = {
  schema,
};
