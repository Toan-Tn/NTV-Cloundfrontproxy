const crypto = require('crypto');
const fs = require('fs');
const dayjs = require('dayjs');
const path = require('path');

function getSignedUrl(domainPath, params) {
  const expiration = params.expireTime || dayjs().add(30, 'minute').unix();
  const keyPairId = params.keyPairId || process.env.KeyPairId;
  const policy = {
    'Statement': [{
      "Resource": domainPath,
      'Condition': {
        'DateLessThan': { 'AWS:EpochTime': expiration },
      }
    }]
  }
  const sign = crypto.createSign('RSA-SHA1');
  const pemPath = path.join(__dirname, params.pemPath || process.env.PemPath);
  const pem = params.privateKeyString || fs.readFileSync(pemPath);
  const key = pem.toString('ascii');
  sign.update(JSON.stringify(policy));
  const signature = sign.sign(key, 'base64');
  const buff = Buffer.from(JSON.stringify(policy));
  const policyBase64 = buff.toString('base64');
  const queryString = {
    'Key-Pair-Id': keyPairId,
    'Expires': expiration,
    'Signature': signature,
    'Policy': policyBase64,
  };
  return queryString;
}

module.exports = { getSignedUrl }