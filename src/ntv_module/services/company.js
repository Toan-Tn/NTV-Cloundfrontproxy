const { GetCommand, UpdateCommand, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const dayjs = require("dayjs");
const util = require('util');
const ajv = require("../boot/ajv");
const { ddbDocClient } = require("../boot/ddbdocclient");
const { BussinessWarning, ValidationError } = require("../boot/errors");
const { sign } = require("../boot/jwt");
const { SUCCESS } = require("../boot/payload");
const { TableName } = require("../constant/db");
const { MESSAGE } = require("../constant/message");
const { loginSchema, newCompanySchema } = require("../schemas/validator/company");
const { compare, hash } = require("../boot/crypto");
const { ddbClient } = require("../boot/ddbclient");

class CompanyService {
  static login = async (data) => {
    const validate = ajv.compile(loginSchema);
    const valid = validate(data);
    if (!valid) {
      throw new ValidationError(MESSAGE.INVALID_INPUT);
    }
    const paramGet = {
      TableName: TableName.COMPANY_USER,
      Key: {
        username: data.username,
        companycode: data.companycode,
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
        TableName: TableName.COMPANY_USER,
        Key: {
          username: user.username,
          companycode: user.companycode,
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
        TableName: TableName.COMPANY_USER,
        Key: {
          username: user.username,
          companycode: user.companycode,
        },
        UpdateExpression: "set loginfail = :loginfail",
        ExpressionAttributeValues: {
          ":loginfail": +user.loginfail + 1,
        },
      };
      await ddbDocClient.send(new UpdateCommand(paramUpdate));
    } else {
      const paramUpdate = {
        TableName: TableName.COMPANY_USER,
        Key: {
          username: user.username,
          companycode: user.companycode,
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

  static createCompany = async (data) => {
    const validate = ajv.compile(newCompanySchema);
    const valid = validate(data);
    let result;
    if (!valid) {
      throw new ValidationError(MESSAGE.INVALID_INPUT);
    }
    const paramGetCode = {
      TableName: TableName.COMPANY,
      Key: {
        companycode: data.companycode,
      },
    };
    result = await ddbDocClient.send(new GetCommand(paramGetCode));
    if (result.Item) {
      throw new BussinessWarning(MESSAGE.COMPANY_CODE_IS_EXIST);
    }
    const paramPutItem = {
      TableName: TableName.COMPANY,
      Item: {
        companycode: data.companycode,
        mail: data.mail,
        name: data.name,
      },
    };
    await ddbDocClient.send(new PutCommand(paramPutItem));
    paramPutItem.TableName = TableName.COMPANY_USER;
    paramPutItem.Item.mail = data.adminmail;
    paramPutItem.Item.username = data.adminuser;
    paramPutItem.Item.password = await hash(data.adminpassword);
    paramPutItem.Item.name = data.adminname;
    paramPutItem.Item.type = 9;
    await ddbDocClient.send(new PutCommand(paramPutItem));
    const paramsFile = {
      TableName: util.format(TableName.FILE_COMPANY, data.companycode),
      KeySchema: [
        { AttributeName: "filepath", KeyType: "HASH" },  //Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: "filepath", AttributeType: "S" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      }
    };
    await ddbClient.send(new CreateTableCommand(paramsFile));
    return SUCCESS();
  }
}

module.exports = { CompanyService }