const Ajv = require('ajv');
const AjvErrors = require('ajv-errors');
const dayjs = require('dayjs');

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  $data: true,
});
// enhance the ajv instance
AjvErrors(ajv);

require('ajv-keywords')(ajv);
require('ajv-formats')(ajv);

ajv.addFormat('datetime-to', {
  validate: (x) => /^\d{4}-(02-(0[1-9]|[12][0-9])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))$/.test(x),
  compare: (date1, date2) => {
    if (!date1 || !date2
      || !dayjs(date1) || !dayjs(date2)) return 0;
    if (dayjs(date1) > dayjs(date2)) return 1;
    if (dayjs(date2) > dayjs(date1)) return -1;
    return 0;
  },
});
ajv.addKeyword({
  keyword: 'isNotEmpty',
  type: 'string',
  validate: function validate(schema, data) {
    if (typeof data === 'string' && data.trim() !== '') return true;
    this.errors = [
      {
        keyword: 'isNotEmpty',
        params: { keyword: 'isNotEmpty' },
      },
    ];
    return false;
  },
  errors: true,
});

module.exports = ajv;
