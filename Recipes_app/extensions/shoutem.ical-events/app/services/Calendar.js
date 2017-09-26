import moment from 'moment';
import { Alert, Linking } from 'react-native';
import CalendarManager, { PERMISSION_ERROR } from 'react-native-calendar-manager';

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
  const fromDate = toMoment(event.start);
  const toDate = event.end ? toMoment(event.end) : fromDate.clone().add(1, 'hours');

  CalendarManager.addEvent({
    name: event.name,
    rsvpLink: event.rsvpLink,
    startTime: fromDate.valueOf(),
    endTime: toDate.valueOf(),
    location: event.location || '',
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

  return toMoment(date).format('MMM D • hh:mm A');
}
