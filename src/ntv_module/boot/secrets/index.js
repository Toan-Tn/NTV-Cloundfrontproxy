const traverse = require('traverse');
const constants = require('./constants');

module.exports = function secrets({ redactedText = '[REDACTED]', keys = constants.KEYS, values = constants.VALUES } = {}) {
  function iskey(str) {
    return keys.some((regex) => RegExp(regex).test(str));
  }

  function isvalue(str) {
    return values.some((regex) => RegExp(regex).test(str));
  }

  function redacted(val) {
    if (iskey(this.key) || isvalue(val)) {
      const showtext = val ? val.toString().substring(0, 3) : '';
      return this.update(`${showtext}${redactedText}`);
    }
    return val;
  }

  function map(obj) {
    return traverse(obj).map(redacted);
  }

  return {
    map,
    iskey,
    isvalue,
  };
};
