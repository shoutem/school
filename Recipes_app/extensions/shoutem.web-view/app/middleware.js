import { Alert, Linking } from 'react-native';
import { priorities, setPriority } from '@shoutem/core/middlewareUtils';

import { OPEN_EXTERNAL_BROWSER } from './redux';
import { NO_URL_MESSAGE } from './const';

const openWebViewScreen = store => next => action => {
  if (action.type === OPEN_EXTERNAL_BROWSER) {
    const { url } = action;

    return url ? Linking.openURL(url) : Alert.alert('No URL', NO_URL_MESSAGE);
  }

  return next(action);
};
setPriority(openWebViewScreen, priorities.NAVIGATION);

export {
  openWebViewScreen,
};
