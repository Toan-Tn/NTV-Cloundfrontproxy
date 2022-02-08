const { GetCommand, UpdateCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const dayjs = require("dayjs");
const ajv = require("../boot/ajv");
const { ddbDocClient } = require("../boot/ddbdocclient");
const { BussinessWarning, ValidationError } = require("../boot/errors");
const { sign } = require("../boot/jwt");
const { SUCCESS } = require("../boot/payload");
const { TableName } = require("../constant/db");
const { MESSAGE } = require("../constant/message");
const { loginSchema, newAdminSchema } = require("../schemas/validator/admin");
const { compare, hash } = require("../boot/crypto");

class AdminService {
  static login = async (data) => {
    const validate = ajv.compile(loginSchema);
    const valid = validate(data);
    if (!valid) {
      throw new ValidationError(MESSAGE.INVALID_INPUT);
    }
    const paramGet = {
      TableName: TableName.ADMIN,
      Key: {
        username: data.username,
      },
    };
    const result = await ddbDocClient.send(new GetCommand(paramGet));
    const { Item: user } = result;
    if (!user) {
      throw new BussinessWarning(MESSAGE.MAIL_PASSWORD_WRONG);
    }
    if (user.locktime
      && dayjs.unix(+user.locktime).add(1, 'minute') > dayjs()) {
      throw new BussinessWarning(MESSAGE.LOGIN_BLOCK, null, 3);
    }
    const ismatch = await compare(data.password, user.password);
    if (ismatch) {
      delete user.password;
      delete user.locktime;
      delete user.loginfail;
      const paramUpdate = {
        TableName: TableName.ADMIN,
        Key: {
          username: user.username,
        },
        UpdateExpression: "set loginfail = :loginfail, locktime = :locktime",
        ExpressionAttributeValues: {
          ":loginfail": 0,
          ":locktime": 0,
        },
      };
      await ddbDocClient.send(new UpdateCommand(paramUpdate));
      const token = sign(user);
      user.token = token;
      return SUCCESS(user);
    }
    if (user.loginfail < 4) {
      const paramUpdate = {
        TableName: TableName.ADMIN,
        Key: {
          username: user.username,
        },
        UpdateExpression: "set loginfail = :loginfail",
        ExpressionAttributeValues: {
          ":loginfail": +user.loginfail + 1,
        },
      };
      await ddbDocClient.send(new UpdateCommand(paramUpdate));
    } else {
      const paramUpdate = {
        TableName: TableName.ADMIN,
        Key: {
          username: user.username,
        },
        UpdateExpression: "set loginfail = :loginfail, locktime = :locktime", // For example, "'set Title = :t, Subtitle = :s'"
        ExpressionAttributeValues: {
          ":loginfail": 0,
          ":locktime": dayjs().unix(),
        },
      };
      await ddbDocClient.send(new UpdateCommand(paramUpdate));
    }
    throw new BussinessWarning(MESSAGE.MAIL_PASSWORD_WRONG);
  }

  static create = async (data) => {
    const validate = ajv.compile(newAdminSchema);
    const valid = validate(data);
    if (!valid) {
      throw new ValidationError(MESSAGE.INVALID_INPUT);
    }
    const paramGet = {
      TableName: TableName.ADMIN,
      Key: {
        username: data.username,
      },
    };
    const result = await ddbDocClient.send(new GetCommand(paramGet));
    const { Item: user } = result;
    if (user) {
      throw new BussinessWarning(MESSAGE.ADMIN_USER_IS_EXIST);
    }
    const passwordHash = await hash(data.password);
    const paramPutItem = {
      TableName: TableName.ADMIN,
      Item: {
        username: data.username,
        password: passwordHash,
        type: data.type,
        name: data.name,
      },
    };
    await ddbDocClient.send(new PutCommand(paramPutItem));
    return SUCCESS();
  }
}

module.exports = { AdminService }