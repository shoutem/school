import FlurryAnalytics from 'react-native-flurry-analytics';

import { isFlurryActive } from './services/flurry';
import { getApiKeyFromState } from './redux';

export function appDidMount(app) {
  const state = app.getState();
  if (!isFlurryActive(state)) {
   return;
  }
  // If user returns app from background for an hour the session will be reused
  const apiKey = getApiKeyFromState(state);
  FlurryAnalytics.setSessionContinueSeconds(60 * 60);
  FlurryAnalytics.startSession(apiKey);
}
