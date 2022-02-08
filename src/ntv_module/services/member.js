const { CreatePlatformEndpointCommand } = require("@aws-sdk/client-sns")
const { GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb")
const dayjs = require("dayjs")
const { sign } = require("jsonwebtoken")
const { ValidationError, BussinessWarning } = require("..")
const ajv = require("../boot/ajv")
const { compare, hash } = require("../boot/crypto")
const { ddbDocClient } = require("../boot/ddbdocclient")
const { SUCCESS } = require("../boot/payload")
const { snsclient } = require("../boot/snsclient")
const { TableName } = require("../constant/db")
const { MESSAGE } = require("../constant/message")
const { updateInfoSchema, loginSchema, forgetPasswordSchema, devicetokenSchema } = require("../schemas/validator/member")


class MemberService {
    static login = async (body) => {
        const validate = ajv.compile(loginSchema)
        const valid = validate(body)
        if (!valid) {
            throw new ValidationError(MESSAGE.INVALID_INPUT)
        }
        const paramGet = {
            TableName: TableName.COMPANY_USER,
            Key: {
                username: body.username,
                companycode: body.companycode
            }
        }
        const result = await ddbDocClient.send(new GetCommand(paramGet))
        const { Item: user } = result
        if (!user) {
            throw new BussinessWarning(MESSAGE.MAIL_PASSWORD_WRONG)
        }
        if (user.locktime && dayjs.unix(+user.locktime).add(1, 'minute') > dayjs()) {
            throw new BussinessWarning(MESSAGE.LOGIN_BLOCK, null, 3)
        }
        const ismatch = await compare(body.password, user.password)
        if (ismatch) {
            delete user.password
            delete user.locktime
            delete user.loginfail
            const paramUpdate = {
                TableName: TableName.COMPANY_USER,
                Key: {
                    username: user.username,
                    companycode: user.companycode
                },
                UpdateExpression: "set loginfail = :loginfail, locktime = :locktime",
                ExpressionAttributeValues: {
                    ":loginfail": 0,
                    ":locktime": 0
                }
            }
            await ddbDocClient.send(new UpdateCommand(paramUpdate))
            const token = sign(user)
            user.token = token
            return SUCCESS(token)
        }
        if (user.loginfail < 4) {
            const paramUpdate = {
                TableName: TableName.COMPANY_USER,
                Key: {
                    username: user.username,
                    companycode: user.companycode
                },
                UpdateExpression: "set loginfail = :loginfail",
                ExpressionAttributeValues: {
                    ":loginfail": +user.loginfail + 1
                }
            }
            await ddbDocClient.send(new UpdateCommand(paramUpdate))
        } else {
            const paramUpdate = {
                TableName: TableName.COMPANY_USER,
                Key: {
                    username: user.username,
                    companycode: user.companycode
                },
                UpdateExpression: "set loginfail = :loginfail,locktime = :locktime",
                ExpressionAttributeValues: {
                    ":loginfail": 0,
                    ":locktime": dayjs().unix()
                }
            }
            await ddbDocClient.send(new UpdateCommand(paramUpdate))
        }
        throw new BussinessWarning(MESSAGE.MAIL_PASSWORD_WRONG)
    }

    static getSetting = async () => {
        const paramGetVersions = {
            TableName: TableName.VERSION
        }
        const result = await ddbClient.send(new GetCommand(paramGetVersions))
        const { Item: appVersions } = result;
        return SUCCESS(appVersions)
    }

    static checkLogin = (body) => {
        return SUCCESS(body)
    }

    static addDeviceToken = async (body) => {
        const validate = ajv.compile(devicetokenSchema)
        const valid = validate(body)
        if (!valid) {
            throw new ValidationError(MESSAGE.INVALID_INPUT)
        }
        if (!body.useragent) {
            const paramEnpoint = {
                Token: body.devicetoken,
                PlatformApplicationArn: ''
            }
            await snsclient.send(new CreatePlatformEndpointCommand(paramEnpoint))
        }
    }

    static logOut = () => {
        return SUCCESS()
    }

    static updateInfo = async (id, body) => {
        const validate = ajv.compile(updateInfoSchema)
        const valid = validate(body)
        if (!valid) {
            throw new ValidationError(MESSAGE.INVALID_INPUT)
        }
        const paramGet = {
            TableName: TableName.COMPANY_USER,
            Key: {
                id: id
            },
        };
        const result = await ddbDocClient.send(new GetCommand(paramGet));
        const { Item: user } = result;
        if (!user) {
            throw new BussinessWarning(MESSAGE.ERROR_MESSAGE_500)
        }
        if (body.type == 1) {
            const isMatch = await compare(body.password, user.password);
            if (!isMatch) {
                throw new BussinessWarning(MESSAGE.MAIL_PASSWORD_WRONG)
            }
            const passwordHash = await hash(body.newPassword)
            const paramsUpdate = {
                TableName: TableName.COMPANY_USER,
                Key: {
                    id: id
                },
                UpdateExpression: "set password = :passwordHash",
                ExpressionAttributeValues: {
                    ":passwordHash": passwordHash
                },
            };
            await ddbDocClient.send(new UpdateCommand(paramsUpdate));
            return SUCCESS({}, 'Thay đổi mật khẩu thành công')
        }
        if (body.type == 2) {
            const paramsUpdate = {
                TableName: TableName.COMPANY_USER,
                Key: {
                    id: id
                },
                UpdateExpression: "set mail = :mail",
                ExpressionAttributeValues: {
                    ":mail": body.mail
                }
            }
            await ddbDocClient.send(new UpdateCommand(paramsUpdate))
            return SUCCESS({}, 'Thay đổi mail thành công')
        }
    }

    static forgetPassword = async (body) => {
        const validate = ajv.compile(forgetPasswordSchema)
        const valid = validate(body)
        if (!valid) {
            throw new ValidationError(MESSAGE.INVALID_INPUT);
        }
        const paramGet = {
            TableName: TableName.COMPANY_USER,
            Key: {

            }
        }
    }
}