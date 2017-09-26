import { combineReducers } from 'redux';
import {
  NOTIFICATION_RECEIVED,
  USER_NOTIFIED,
} from './actionTypes';

function addPushNotification(state = {}, action) {
  switch (action.type) {
    case NOTIFICATION_RECEIVED:
      return { notificationContent: action };
    case USER_NOTIFIED:
      return {};
    default:
      return state;
  }
}

export default combineReducers({
  lastNotification: addPushNotification,
});
