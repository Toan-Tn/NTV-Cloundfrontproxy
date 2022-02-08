const os = require('os');
const { SECRETS } = require('../boot/secrets/secrets');
const redactSecrets = require('../boot/secrets')({ redactedText: '***Mask***', keys: SECRETS });

class Logger {
  constructor(logName) {
    this.defaultLayout = {
      ec2_name: os.hostname(),
      logName,
    };
  }

  async writeLog(data, meta = {}) {
    const layout = {
      ...this.defaultLayout,
    };
    const message = Object.assign(layout, meta, data);
    console.log(JSON.stringify(message));
  }

  async debug(message, meta = {}) {
    const content = {
      level: 'DEBUG',
      message,
    };
    this.writeLog(content, meta);
  }

  async info(message, meta = {}) {
    const content = {
      level: 'INFO',
      message,
    };
    this.writeLog(content, meta);
  }

  async warn(message, meta = {}) {
    const content = {
      level: 'WARN',
      message,
    };
    this.writeLog(content, meta);
  }

  async trace(message, meta = {}) {
    const content = {
      level: 'TRACE',
      message,
    };
    this.writeLog(content, meta);
  }

  async fatal(message, meta = {}) {
    const content = {
      level: 'FATAL',
      message,
    };
    this.writeLog(content, meta);
  }

  async error(message, meta = {}) {
    const content = {
      level: 'ERROR',
      message,
    };
    this.writeLog(content, meta);
  }
}

const NTV_LOGGER = new Logger('ntv');
NTV_LOGGER.request = async (request) => {
  let body = {};
  try {
    if (request.body) {
      body = JSON.parse(request.body);
    }
  } catch (ex) {
    body = request.body;
  }
  
  const data = {
    ...body,
    ...request.queryStringParameters,
    ...request.pathParameters,
  };
  const { user } = request;
  const meta = {
    type: 'REQUEST',
    request_id: request.requestContext,
    user,
  };
  const message = process.env.StageName !== 'production' ? data : redactSecrets.map(data);
  NTV_LOGGER.info(message, meta);
};
NTV_LOGGER.response = async (request, payload) => {
  let data = {};
  try {
    data = JSON.parse(payload.body);
  } catch (ex) {
    data = {};
  }
  const { user } = request;

  const meta = {
    type: 'RESPONSE',
    request_id: request.requestContext,
    statusCode: payload.statusCode,
    user,
  };
  const message = process.env.StageName !== 'production' ? data : redactSecrets.map(data);
  NTV_LOGGER.info(message, meta);
};

NTV_LOGGER.exception = async (message, metaInput, request) => {
  const { user } = request;

  const meta = {
    request_id: request.requestContext,
    user,
    ...metaInput,
  };
  NTV_LOGGER.error(message, meta);
};

NTV_LOGGER.business = async (message, metaInput, request) => {
  const { user } = request;

  const meta = {
    request_id: request.requestContext,
    user,
    ...metaInput,
  };
  NTV_LOGGER.warn(message, meta);
};

module.exports = {
  NTV_LOGGER,
};
