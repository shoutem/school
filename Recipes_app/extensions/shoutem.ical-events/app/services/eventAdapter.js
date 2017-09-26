import _ from 'lodash';
import moment from 'moment';

function toDate(date, time, timeZone) {
  const offset = timeZone && timeZone.split('UTC')[1];
  return moment(`${date} ${time} ${offset}`, 'YYYY-MM-DD HH:mm:ss ZZ').toDate();
}

export default function adaptProxiedEvent(proxiedEvent) {
  const {
    summary,
    startDate,
    startTime,
    startTimeZone,
    endDate,
    endTime,
    endTimeZone,
    description,
    location,
    attachments,
    geo,
    RSVP
  } = proxiedEvent;

  const start = toDate(startDate, startTime, startTimeZone);
  const end = toDate(endDate, endTime, endTimeZone);
  const name = summary;
  const imageUrl = _.get(attachments, '[0].source');

  return { 
    name,
    summary,
    description,
    startDate,
    startTime,
    startTimeZone,
    endDate,
    endTime,
    endTimeZone,
    location,
    attachments,
    start, 
    end, 
    imageUrl, 
    geo, 
    RSVP
  };
}
