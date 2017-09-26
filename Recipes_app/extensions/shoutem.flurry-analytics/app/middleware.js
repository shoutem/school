import { setPriority } from '@shoutem/core/middlewareUtils';

import {
  createScreenViewMiddleware,
  createEventsMiddleware,
  ANALYTICS_OUT_MIDDLEWARE_PRIORITY,
} from 'shoutem.analytics';

import FlurryAnalytics from 'react-native-flurry-analytics';

import { isFlurryActive } from './services/flurry';

function trackScreenView(action, store) {
  if (!isFlurryActive(store.getState())) {
    return;
  }
  const screenName = action.title || action.screen;
  // This is just a counter for Flurry dashboard on y.flurry.com,
  // and it isn't available in analytics reporting API.
  FlurryAnalytics.logPageView();
  FlurryAnalytics.logEvent('Screen view', { screenName });
}
setPriority(trackScreenView, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

function trackEvents(action, store) {
  if (!isFlurryActive(store.getState())) {
    return;
  }
  const { resource, payload } = action;
  FlurryAnalytics.logEvent(action.action, { resource, ...payload });
}
setPriority(trackEvents, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

export default [createScreenViewMiddleware(trackScreenView), createEventsMiddleware(trackEvents)];
