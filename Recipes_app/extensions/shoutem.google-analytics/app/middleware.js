import { setPriority } from '@shoutem/core/middlewareUtils';

import {
  createScreenViewMiddleware,
  createEventsMiddleware,
  ANALYTICS_OUT_MIDDLEWARE_PRIORITY,
} from 'shoutem.analytics';
import { isProduction } from 'shoutem.application';

import { googleAnalytics } from './ga';

function trackScreenView(action) {
  if (isProduction()) {
    const screenName = action.title || action.screen;
    googleAnalytics.trackScreenViewWithCustomDimensionValues(screenName, action.payload);
  }
}
setPriority(trackScreenView, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

function trackEvents(action) {
  if (isProduction()) {
    googleAnalytics.trackEventWithCustomDimensionValues(
      action.resource,
      action.action,
      {label: action.payload.title},
      action.payload
    );
  }
}
setPriority(trackEvents, ANALYTICS_OUT_MIDDLEWARE_PRIORITY);

export default [createScreenViewMiddleware(trackScreenView), createEventsMiddleware(trackEvents)];
