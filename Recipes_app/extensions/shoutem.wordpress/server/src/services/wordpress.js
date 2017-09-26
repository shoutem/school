import validator from 'validator';
import moment from 'moment';

const RSS_DATE_TIME_FORMAT = 'MMM DD YYYY';
moment.locale('en');

export function toLocalDateTime(dateTime) {
  const MAX_DIFFERENCE_IN_HOURS = 12;
  const date = new Date(dateTime);

  if (date.toString() === 'Invalid Date') {
    return {
      dateTimeFormatted: ' - ',
      dateTimeDisplay: ' - ',
    };
  }

  const originalDate = moment(date);
  const nowDate = moment(new Date());
  const differenceInHours = nowDate.diff(originalDate, 'hours');
  const dateTimeFormatted = originalDate.format(RSS_DATE_TIME_FORMAT);
  const displayTimeAgo = differenceInHours <= MAX_DIFFERENCE_IN_HOURS;
  const dateTimeDisplay = displayTimeAgo ? originalDate.from(nowDate) : dateTimeFormatted;

  return {
    dateTimeFormatted,
    dateTimeDisplay,
  };
}
const validateUrl = url => validator.isURL(url, { require_protocol: false });

export function validateWordpressUrl(url) {
  if (!url || !validateUrl(url)) {
    return false;
  }
  return true;
}
