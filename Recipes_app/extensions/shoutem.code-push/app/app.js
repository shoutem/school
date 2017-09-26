import { AppState } from 'react-native';
import codePush from 'react-native-code-push';

import { isProduction } from 'shoutem.application';

import { syncPackage } from './shared/syncPackage';
import { getDeploymentFromState } from './redux';

function getNewBundle(app) {
  const store = app.getStore();
  const state = store.getState();
  const deployment = getDeploymentFromState(state);
  const showUpdateDialog = !app.props.isAppetize;
  if (deployment && deployment.key) {
    // Update package if there are any new changes.
    // Update dialog is hidden by default
    syncPackage(deployment.key, showUpdateDialog);
  }
}

let handleAppStateChange;

const createHandleAppStateChange = (app) => (state) => {
  if (state === 'active') {
    getNewBundle(app);
  }
};

export function appWillMount() {
  if (isProduction()) {
    return codePush.notifyAppReady();
  }
}

export function appDidMount(app) {
  // Check for updates on app start
  if (isProduction()) {
    getNewBundle(app);
    handleAppStateChange = createHandleAppStateChange(app);
    // Check for updates on app resume
    AppState.addEventListener('change', handleAppStateChange);
  }
}

export function appWillUnmount() {
  if (isProduction()) {
    AppState.removeEventListener('change', handleAppStateChange);
  }
}
