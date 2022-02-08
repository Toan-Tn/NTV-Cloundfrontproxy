const { companySchema } = require("../models/company");
const { userSchema } = require("../models/user");

const loginSchema = {
  type: "object",
  properties: {
    companycode: {
      ...userSchema.companycode,
    },
    username: {
      ...userSchema.username,
    },
    password: {
      ...userSchema.password,
    },
  },
  required: ["companycode", "username", "password"],
  additionalProperties: false,
}

const newCompanySchema = {
  type: "object",
  properties: {
    companycode: {
      ...companySchema.companycode,
    },
    mail: {
      ...companySchema.mail,
    },
    name: {
      ...companySchema.name,
    },
    adminmail: {
      ...userSchema.mail,
    },
    adminuser: {
      ...userSchema.username,
    },
    adminpassword: {
      ...userSchema.password,
    },
    adminname: {
      ...userSchema.name,
    },
  },
  required: ["companycode", "mail", "name", "adminmail", "adminuser", "adminpassword", "adminname"],
  additionalProperties: false,
}

module.exports = { loginSchema, newCompanySchema }