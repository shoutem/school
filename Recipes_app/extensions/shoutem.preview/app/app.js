import { Linking } from 'react-native';
import { RESTART_APP } from '@shoutem/core/coreRedux';

import {
  openInitialScreen,
  actions,
  isProduction,
  getAppId,
} from 'shoutem.application';

function getAppIdFromUrl(url) {
  const matches = url.match(/preview:\/\/open-app\/([0-9]*)/);
  return matches.length ? matches[1] : undefined;
}

function listenForDeepLinks(dispatch) {
  Linking.addEventListener('url', (deepLink) => {
    const appId = getAppIdFromUrl(deepLink.url);
    // check if link is for the right app
    if (appId === getAppId()) {
      // restart app to run app lifecycle from start
      dispatch({ type: RESTART_APP });
    }
  });
}

export const appDidMount = (app) => {
  const store = app.getStore();
  const dispatch = store.dispatch;
  if (!isProduction()) {
    listenForDeepLinks(dispatch);
  }
};

export function appWillUnmount() {
  Linking.removeEventListener('url');
}
