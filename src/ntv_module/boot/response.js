const RESPONSE = (payload = {}, headers) => {
  const defaults = {
    'content-type': 'application/json; charset=utf-8',
  }
  if (typeof headers == 'object') {
    headers = Object.assign({}, defaults, headers);
  } else {
    headers = defaults;
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify(payload),
    headers,
  };
  return response;
}
module.exports = { RESPONSE }