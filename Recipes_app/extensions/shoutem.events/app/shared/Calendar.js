import _ from 'lodash';
import moment from 'moment';
import { Alert, Linking } from 'react-native';
import CalendarManager, { PERMISSION_ERROR } from 'react-native-calendar-manager';
import { DeviceInfo } from 'shoutem.application';

const showSuggestionToGrantCalendarAccess = () => {
  Alert.alert(
    'Grant calendar access',
    'You disabled calendar access for this application. Do you want to enable it in' +
      ' settings now?',
    [
      { text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
      { text: 'Cancel' },
    ],
  );
};

export function toMoment(date) {
  return moment(date, 'YYYY-MM-DDThh:mm:ssZ');
}

export function addToCalendar(event) {
  const fromDate = toMoment(event.startTime);
  const toDate = event.endTime ? toMoment(event.endTime)
                               : fromDate.clone().add(1, 'hours');

  CalendarManager.addEvent({
    name: event.name,
    rsvpLink: event.rsvpLink,
    startTime: fromDate.valueOf(),
    endTime: toDate.valueOf(),
    location: _.get(event, 'location.formattedAddress', ''),
  }, (error) => {
    console.log(error);
    if (error.type === PERMISSION_ERROR) {
      showSuggestionToGrantCalendarAccess();
    }
  });
}

export function formatDate(date) {
  if (!date) {
    return '';
  }

  const hourFormat24 = _.get(DeviceInfo, 'HOUR_FORMAT.H24');
  let format = 'MMM D • hh:mm A';

  if (hourFormat24 === DeviceInfo.getHourFormat()) {
    format = 'MMM D • HH:mm';
  }
  return toMoment(date).format(format);
}
