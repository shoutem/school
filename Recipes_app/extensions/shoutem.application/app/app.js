import { AppState } from 'react-native';
import * as _ from 'lodash';

import rio, { checkExpiration } from '@shoutem/redux-io';
import { applyToAll } from '@shoutem/redux-composers';
import { initializeUiAddons } from '@shoutem/ui-addons';

import { extractAppActions } from './shared/extractAppActions';
import { resolveAppEndpoint } from './shared/resolveAppEndpoint';
import { openInitialScreen } from './shared/openInitialScreen';
import { isRelease } from './shared/isRelease';
import { isConfigurationLoaded } from './shared/isConfigurationLoaded';
import { CONFIGURATION_SCHEMA, ACTIVE_APP_STATE } from './const';
import buildConfig from './buildConfig.json';
import {
  loadLocalConfiguration,
  fetchConfiguration,
} from './redux';

export const appActions = {};
let appStateChangeHandler; // Dynamically created handler;
let appState = ACTIVE_APP_STATE;

let application;
let unsubscribeFromConfigurationLoaded;

export const getAppId = () => {
  if (_.isEmpty(application)) {
    console.warn('You called getAppId before appWillMount has finished.');
  }

  return _.get(application, 'props.appId') || buildConfig.appId;
};

export const initializeApp = () => {
  initializeUiAddons();
};

function loadConfiguration(app) {
  const store = app.getStore();
  const dispatch = store.dispatch;
  return new Promise((resolve) => {
    // resolve Promise from appWillMount when configuration is available in state
    unsubscribeFromConfigurationLoaded = store.subscribe(() => {
      if (isConfigurationLoaded(store.getState())) {
        resolve();
      }
    });
    if (isRelease()) {
      dispatch(loadLocalConfiguration());
    } else {
      const appId = getAppId(app);
      dispatch(fetchConfiguration(appId));
    }
  });
}

function registerConfigurationSchema() {
  rio.registerSchema({
    schema: CONFIGURATION_SCHEMA,
    request: {
      // appId is RIO url variable because it can be changed when fetching configuration
      // in preview mode depending on provided appId in deeplink
      endpoint: resolveAppEndpoint('configurations/current', '{appId}'),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${buildConfig.authorization}`,
      },
    },
  });
}

function dispatchCheckExpiration(app) {
  app.getStore().dispatch(applyToAll(checkExpiration()));
}

function createAppStateChangeHandler(app) {
  return (newAppState) => {
    if (appState !== newAppState && newAppState === ACTIVE_APP_STATE) {
      dispatchCheckExpiration(app);
    }
    appState = newAppState;
  };
}

export function appWillMount(app) {
  application = app;
  registerConfigurationSchema();
  extractAppActions(app, appActions);

  // Handler is saved into variable so it can be removed on unmount
  appStateChangeHandler = createAppStateChangeHandler(app);
  AppState.addEventListener('change', appStateChangeHandler);

  // When app is started first "AppState change" is skipped but we still
  // want to check expiration of local content (AppState is active).gst
  dispatchCheckExpiration(app);

  return loadConfiguration(app);
}

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  if (!isConfigurationLoaded(state)) {
    throw new Error('App configuration failed to load.');
  }
  unsubscribeFromConfigurationLoaded();
}

/**
 * Returns true if environment is development, false otherwise.
 */
export const isDevelopment = () => process.env.NODE_ENV === 'development';

export function appDidFinishLaunching(app) {
  openInitialScreen(app);
}

export function appWillUnmount() {
  AppState.removeEventListener('change', appStateChangeHandler);
}
