const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const duration = require('dayjs/plugin/duration');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

dayjs.getDate = (date = dayjs(), timeZone = 'Asia/Tokyo') => dayjs(date).tz(timeZone);

dayjs.compareTwoDate = (date1, date2) => {
  const d1 = dayjs.getDateWithFormat(date1).format('YYYYMMDD');
  const d2 = dayjs.getDateWithFormat(date2).format('YYYYMMDD');
  if (d1 === d2) return 0;
  if (d1 < d2) return -1;
  return 1;
};

module.exports = dayjs;
