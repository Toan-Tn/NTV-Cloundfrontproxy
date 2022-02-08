const { adminSchema } = require("../models/admin")

const loginSchema = {
  type: "object",
  properties: {
    username: {
      ...adminSchema.username,
    },
    password: {
      ...adminSchema.password,
    },
  },
  required: ["username", "password"],
  additionalProperties: false,
}

const newAdminSchema = {
  type: "object",
  properties: {
    username: {
      ...adminSchema.username,
    },
    password: {
      ...adminSchema.password,
    },
    type: {
      ...adminSchema.type,
    },
    name: {
      ...adminSchema.name,
    },
  },
  required: ["username", "password", "type", "name"],
  additionalProperties: false,
}

module.exports = { loginSchema, newAdminSchema }