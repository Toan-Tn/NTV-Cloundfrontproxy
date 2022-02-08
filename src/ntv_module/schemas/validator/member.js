const { userSchema } = require('../models/user')

const updateInfoSchema = {
    type: "object",
    properties: {
        email: {
            ...userSchema.mail
        },
        password: {
            ...userSchema.password
        },
        newPassword: {
            ...userSchema.password
        },
        type: {
            type: 'integer',
            enum: [1, 2]
        }
    },
    required: ["type"],
    additionalProperties: false
}

const loginSchema = {
    type: "object",
    properties: {
        companycode: {
            ...userSchema.companycode
        },
        username: {
            ...userSchema.name
        },
        password: {
            ...userSchema.password
        }
    },
    required: ["companycode", "userName", "password"],
    additionalProperties: false
}

const forgetPasswordSchema = {
    type: "object",
    properties: {
        email: {
            ...userSchema.mail
        },
        username: {
            ...userSchema.name
        },
        companycode: {
            ...userSchema.companycode
        }
    },
    required: ["email", "username", "companycode"],
    additionalProperties: false
}

const devicetokenSchema = {
    type: "object",
    properties: {
        devicetoken: {
            type: "string",
            maxLength: 256
        }
    },
    required: ["devicetoken"],
    additionalProperties: false
}

module.exports = { updateInfoSchema, loginSchema, forgetPasswordSchema, devicetokenSchema }