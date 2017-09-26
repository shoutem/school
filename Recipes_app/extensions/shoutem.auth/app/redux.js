import _ from 'lodash';

import { combineReducers } from 'redux';

import { find, resource, update } from '@shoutem/redux-io';
import { chainReducers } from '@shoutem/redux-composers';
import { preventStateRehydration } from '@shoutem/core/preventStateRehydration';

import { getAppId } from 'shoutem.application';

import { ext } from './const';

export const LOGIN = 'shoutem.auth.LOGIN';
export const LOGOUT = 'shoutem.auth.LOGOUT';
export const AUTHENTICATE = 'shoutem.auth.AUTHENTICATE';
export const RESTORE_SESSION = 'shoutem.auth.RESTORE_SESSION';
export const REGISTER = 'shoutem.auth.REGISTER';

export const USER_SCHEMA = 'shoutem.auth.user';
export const USER_PROFILE_SCHEMA = 'shoutem.auth.user-profile';
export const USER_PROFILE_IMAGE_SCHEMA = 'shoutem.auth.user-profile-image';
export const USER_CREDENTIALS_SCHEMA = 'shoutem.auth.user-credentials';
export const USER_FACEBOOK_CREDENTIALS_SCHEMA = 'shoutem.auth.user-facebook-credentials';

const sessionReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case RESTORE_SESSION:
      return payload;
    case LOGOUT:
      return {};
    default:
      return { ...state };
  }
};

const userReducer = combineReducers({
  user: chainReducers([
    resource(USER_PROFILE_SCHEMA),
    resource(USER_PROFILE_IMAGE_SCHEMA),
  ]),
  session_id: (state = '') => state,
  access_token: (state = '') => state,
});

export default preventStateRehydration(
  chainReducers([
    sessionReducer,
    resource(USER_SCHEMA),
    resource(USER_CREDENTIALS_SCHEMA),
    resource(USER_FACEBOOK_CREDENTIALS_SCHEMA),
    userReducer,
  ]),
);

export function register(email, username, password) {
  return find(USER_SCHEMA, '', { email, username, password });
}

export function login(email, password) {
  return find(USER_CREDENTIALS_SCHEMA, '', { email, password });
}

export function loginWithFacebook(accessToken) {
  return find(USER_FACEBOOK_CREDENTIALS_SCHEMA, '', { accessToken });
}

export function updateProfile(updates) {
  return (dispatch, getState) => {
    const body = {
      ...updates,
      session_id: getState()[ext()].session_id,
      nid: getAppId(),
    };

    const schemaConfig = {
      request: {
        body: JSON.stringify(body),
      },
      schema: USER_PROFILE_SCHEMA,
    };

    return dispatch(update(schemaConfig));
  };
}

export function updateProfileImage(imageData) {
  return (dispatch, getState) => {
    const body = {
      file_attachment: imageData,
      session_id: getState()[ext()].session_id,
    };

    const schemaConfig = {
      request: {
        body: JSON.stringify(body),
      },
      schema: USER_PROFILE_IMAGE_SCHEMA,
    };

    return dispatch(update(schemaConfig));
  };
}

export const userLoggedIn = user => ({
  type: LOGIN,
  payload: user,
});

export const userRegistered = user => ({
  type: REGISTER,
  payload: user,
});

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function authenticate(callback) {
  return {
    type: AUTHENTICATE,
    callback,
  };
}

// function checks whether or not the user is logged in the application
// if the user is logged the acces token value in state is set
export function isAuthenticated(state) {
  return !_.isEmpty(state[ext()].access_token);
}

// function returns access token
export function getAccessToken(state) {
  return state[ext()].access_token;
}

export const isUserUpdateAction = (action) => {
  const schema = _.get(action, 'meta.schema');

  return _.includes([USER_PROFILE_SCHEMA, USER_PROFILE_IMAGE_SCHEMA], schema);
};


// function checks if user exists and if it does returns object with user data
// if user doesn't exist function returns undefined
export function getUser(state) {
  if (!_.isEmpty(state[ext()].user)) {
    return state[ext()].user;
  }
  return undefined;
}

export function logoutAction() {
  return (dispatch) => {
    dispatch(logout());
  };
}
