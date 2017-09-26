import _ from 'lodash';
import { priorities, after, setPriority } from '@shoutem/core/middlewareUtils';
import { getAppId, getActiveShortcut } from 'shoutem.application';
import { getActiveRoute } from '@shoutem/core/navigation';
import { EVENT, SCREEN_VIEW, isAnalyticsAction } from './redux';

// Use to intercept analytics actions and provide more data to the action
export const ANALYTICS_MIDDLEWARE_PRIORITY = priorities.NAVIGATION;
// Use to intercept analytics actions and pass data to native SDK or server
export const ANALYTICS_OUT_MIDDLEWARE_PRIORITY = after(ANALYTICS_MIDDLEWARE_PRIORITY);

function getExtensionNameFromScreen(screen) {
  const extensionName = screen && _.slice(screen.split('.'), 0, 2);
  return extensionName ? extensionName[0] : undefined;
}

/**
 * Create middleware which will only be invoked if
 * analytic action type is {@see EVENT}
 * @param middleware
 * @returns {middleware}
 */
export function createEventsMiddleware(middleware) {
  return store => next => action => {
    if (action.type === EVENT) {
      middleware(action, store);
    }
    return next(action);
  };
}

/**
 * Create middleware which will only be invoked if
 * analytic action type is {@see SCREEN_VIEW}
 * @param middleware
 * @returns {middleware}
 */
export function createScreenViewMiddleware(middleware) {
  return store => next => action => {
    if (action.type === SCREEN_VIEW) {
      middleware(action, store);
    }
    return next(action);
  };
}

/**
 * Additional data provided to analytics action.
 * @param store
 * @returns {{appId: *, screen: V, shortcut: *}}
 */
function getApplicationAnalyticsData(store) {
  const state = store.getState();
  const activeRoute = getActiveRoute(state);

  const screen = activeRoute.screen;
  const extension = getExtensionNameFromScreen(screen);
  const shortcutId = (getActiveShortcut(state) || {}).id;
  const appId = `${getAppId()}`; // All GA dimensions values should be sent as strings

  return { appId, extension, screen, shortcutId };
}

/**
 * Used to extend analytics actions with application data (appId, screen, shortcut)
 */
const injectApplicationDataToAnalyticsAction = store => next => action => {
  if (isAnalyticsAction(action)) {
    _.assign(action.payload, getApplicationAnalyticsData(store));
  }
  return next(action);
};
setPriority(injectApplicationDataToAnalyticsAction, ANALYTICS_MIDDLEWARE_PRIORITY);

export default [injectApplicationDataToAnalyticsAction];
