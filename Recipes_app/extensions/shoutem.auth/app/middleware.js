import {
  isRSAA,
  RSAA,
} from 'redux-api-middleware';

import * as _ from 'lodash';
import URI from 'urijs';

import { UPDATE_SUCCESS } from '@shoutem/redux-io';

import {
  isEmptyRoute,
  isNavigationAction,
  navigateTo,
  redirectTo,
  rewrite,
  REPLACE,
} from '@shoutem/core/navigation';

import { priorities, setPriority, before } from '@shoutem/core/middlewareUtils';

import { RESTART_APP } from '@shoutem/core/coreRedux';
import { getExtensionSettings } from 'shoutem.application';

import { ext } from './const';
import {
  isAuthenticated,
  isUserUpdateAction,
  getUser,
  LOGOUT,
  AUTHENTICATE,
} from './redux';

import { getAuthHeader } from './shared/getAuthHeader';
import { isAuthenticationRequired } from './isAuthenticationRequired';

import {
  clearSession,
  getSession,
  saveSession,
} from './session.js';

const APPLICATION_EXTENSION = 'shoutem.application';
const AUTH_HEADERS = 'headers.Authorization';

const hasValidRoute = action => action.route && !isEmptyRoute(action.route);

export function createLoginMiddleware(screens) {
  return setPriority(store => next => (action) => {
    // We want to intercept only actions with a route because this is the only way
    // to open a new screen.
    if (isNavigationAction(action) && hasValidRoute(action)) {
      const state = store.getState();
      if (isAuthenticationRequired(screens, action, state) && !isAuthenticated(state)) {
        return next(redirectTo(action, {
          screen: ext('LoginScreen'),
          props: {
            action,
            onLoginSuccess: () => store.dispatch(rewrite(action, REPLACE)),
          },
        }));
      }
    }

    return next(action);
  }, priorities.AUTH);
}

/**
 * Enables an action within a screen to require authentication.
 * For example, when a comment button is clicked and this action requires a session.
 *
 * If the user is not authenticated, this middleware will present a login screen.
 * After successful login, it will execute the callback provided in the action.
 * If the user is already logged in, the callback will be immediately executed.
 */
export const authenticateMiddleware = setPriority(store => next => (action) => {
  if (action.type === AUTHENTICATE) {
    const state = store.getState();

    if (isAuthenticated(state)) {
      action.callback(state[ext()].user);
    } else {
      store.dispatch(navigateTo({
        screen: ext('LoginScreen'),
        props: {
          onLoginSuccess: action.callback,
        },
      }));
    }
  }

  return next(action);
}, priorities.AUTH);

/**
 * Listens to user profile changes and updates the saved session.
 * When the app is restarted and we restore the session, it will have the updates.
 */
export const userUpdatedMiddleware = store => next => (action) => {
  if (action.type === UPDATE_SUCCESS && isUserUpdateAction(action)) {
    getSession().then((session = {}) => {
      const user = getUser(store.getState());

      const newSession = { ...JSON.parse(session), user };
      saveSession(JSON.stringify(newSession));
    });
  }
  return next(action);
};

let legacyApiDomain;

/**
 * Sets header Authorization value for every network request to endpoints registered
 * in shoutem.application that doesn't already include any Authorization header
 */
export const networkRequestMiddleware = setPriority(store => next => (action) => {
  if (isRSAA(action)) {
    const state = store.getState();

    if (!legacyApiDomain) {
      const appSettings = getExtensionSettings(state, APPLICATION_EXTENSION);

      const { legacyApiEndpoint } = appSettings;

      legacyApiDomain = legacyApiEndpoint && new URI(legacyApiEndpoint).domain();
    }

    const endpointDomain = new URI(action[RSAA].endpoint).domain();

    if (legacyApiDomain === endpointDomain && !_.has(action[RSAA], AUTH_HEADERS)) {
      _.set(action[RSAA], AUTH_HEADERS, getAuthHeader(state));
    }
  }

  return next(action);
}, before(priorities.NETWORKING));

export const logoutMiddleware = setPriority(store => next => (action) => {
  const actionType = _.get(action, 'type');

  if (actionType === LOGOUT) {
    clearSession().then(
      () => store.dispatch({ type: RESTART_APP }),
      reason => console.warn(reason),
    );
  }
  return next(action);
}, priorities.AUTH);
