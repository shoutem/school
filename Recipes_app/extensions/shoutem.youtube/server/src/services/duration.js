import moment from 'moment';
import 'moment-duration-format';

export function getFormatDuration(duration) {
  return moment.duration(duration).format('h:mm:ss', { trim: false, forceLength: true });
}
