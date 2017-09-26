// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import _ from 'lodash';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';

import reducer, {
  getUser,
  getAccessToken,
  authenticate,
  logoutAction,
  isAuthenticated,
  RESTORE_SESSION,
  LOGIN,
  LOGOUT,
  REGISTER,
} from './redux';

import {
  createLoginMiddleware,
  networkRequestMiddleware,
  logoutMiddleware,
  userUpdatedMiddleware,
} from './middleware';

import { loginRequired } from './loginRequired';

const appScreens = {};

function appWillMount(app) {
  _.each(app.getScreens(), (Screen, screenName) => { appScreens[screenName] = Screen; });
}

export const screens = {
  LoginScreen,
  RegisterScreen,
  UserProfileScreen,
  EditProfileScreen,
};

export { reducer };

export const actions = {
  logoutAction,
};

const middleware = [
  createLoginMiddleware(appScreens),
  networkRequestMiddleware,
  logoutMiddleware,
  userUpdatedMiddleware,
];

export { appDidMount } from './app';

export {
  appWillMount,
  appScreens,
  middleware,
  getUser,
  getAccessToken,
  authenticate,
  loginRequired,
  isAuthenticated,
  LOGIN,
  LOGOUT,
  REGISTER,
  RESTORE_SESSION,
};
