import _ from 'lodash';

import {
  Alert,
  AppState,
} from 'react-native';

import { ext } from './const';

import {
  selectPushNotificationGroups,
  userNotified,
  requestPushPermission,
} from './redux';

const DEFAULT_PUSH_NOTIFICATION_GROUP = 'broadcast';

let appStateChangeHandler; // Dynamically created handler;

const appWillMount = (app) => {
  AppState.addEventListener('change', (newAppState) => {
    // Every time the application becomes active, we clear badges
    // and act as if the user has been notified.
    if(newAppState === 'active') {
       const store = app.getStore();
       store.dispatch(userNotified());
    }
  });
}

const appDidMount = (app) => {
  const store = app.getStore();

  function getLastNotification() {
    const state = store.getState();
    return state[ext()].lastNotification;
  }

  function onNotificationAction(notificationContent) {
    const action = _.get(notificationContent, 'action');

    if (!!action) {
      store.dispatch(action);
    }
  }

  function displayPushNotificationMessage(notification) {
    const notificationContent = notification.content;
    store.dispatch(userNotified());

    if(notificationContent.openedFromTray) {
      return onNotificationAction(notificationContent);
    }

    Alert.alert(
      'Message received',
      notificationContent.body,
      [
        { text: 'View', onPress: onNotificationAction.bind(null, notificationContent) },
        { text: 'Dismiss', onPress: () => {} },
      ]
    );
  }

  store.subscribe(() => {
    const lastNotification = getLastNotification();

    if (lastNotification && !!lastNotification.notificationContent) {
      displayPushNotificationMessage(lastNotification.notificationContent);
    }
  });

  store.dispatch(requestPushPermission());
};

const appWillUnmount = () => {
  AppState.removeEventListener('change', appStateChangeHandler);
};

export {
  appDidMount,
  appWillMount,
  appWillUnmount,
};
