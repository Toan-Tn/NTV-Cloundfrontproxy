const makePresignUploadSchema = {
  type: "object",
  properties: {
    file: {
      type: 'string',
      minLength: 1,
    },
    sizefile: {
      type: 'integer',
      minimum: 1,
    },
  },
  required: ["file", "sizefile"],
  additionalProperties: false,
}

module.exports = { makePresignUploadSchema }