import _ from 'lodash';
import { combineReducers } from 'redux';

import { storage, find, one, getOne, loaded } from '@shoutem/redux-io';
import { getActiveRoute } from '@shoutem/core/navigation';

import configuration from './configuration.json';
import {
  ext,
  CONFIGURATION_SCHEMA,
  CONFIGURATION_TAG,
  APPLICATION_SCHEMA,
  SHORTCUTS_SCHEMA,
  SCREENS_SCHEMA,
  EXTENSIONS_SCHEMA,
} from './const';
import { preventStateRehydration } from '@shoutem/core/preventStateRehydration';

// Because of chrome inspection bug we are exporting function as constants
// Bug is we can not set breakpoint in files which export function directly
/* eslint-disable func-names */

export const EXECUTE_SHORTCUT = 'shoutem.application.EXECUTE_SHORTCUT';
export const SET_ACTIVE_SHORTCUT = 'shoutem.application.SET_ACTIVE_SHORTCUT';

export function fetchConfiguration(appId) {
  return find(CONFIGURATION_SCHEMA, CONFIGURATION_TAG, { appId });
}

export function loadLocalConfiguration() {
  return loaded(configuration, CONFIGURATION_SCHEMA, CONFIGURATION_TAG);
}

export const getConfiguration = function (state) {
  return getOne(state[ext()].configuration, state);
};

export const getShortcut = (state, shortcutId) =>
  getOne(shortcutId, state, 'shoutem.core.shortcuts');

export function getActiveShortcut(state, action) {
  const activeRoute = _.get(action, 'route') || getActiveRoute(state);
  const activeShortcutId = _.get(activeRoute, 'context.shortcutId');

  if (!activeShortcutId) {
    return undefined;
  }

  return getShortcut(state, activeShortcutId);
}

/**
 * Creates a redux action that is used to execute shortcuts provided by configuration
 * @param shortcutId {string} an Id of a shortcut
 * @param navigationAction The navigation action type to use (navigate, replace,
 *  reset to route, open in modal etc.). Shoutem core will resolve the navigation action from this type,
 *  with a sensible default if none is provided.
 * @param navigationStack The navigation stack to execute the shortcutId on.
 * @returns {{type: string, shortcutId: *}} a redux action with type EXECUTE_SHORTCUT
 */
export const executeShortcut = (shortcutId, navigationAction, navigationStack) => ({
  type: EXECUTE_SHORTCUT,
  navigationStack,
  navigationAction,
  shortcutId,
});

/**
 * A selector that returns extension settings of the currently running application.
 *
 * @param state The redux state
 * @param extensionName The name of the currently running application
 * @returns {*} Settings of application
 */
export const getExtensionSettings = function (state, extensionName) {
  return _.get(state[ext()], ['extensions', extensionName, 'attributes', 'settings'], {});
};

// create reducer with wanted default configuration
const reducer = combineReducers({
  configuration: one(CONFIGURATION_SCHEMA, CONFIGURATION_TAG, undefined),
  configurations: storage(CONFIGURATION_SCHEMA),
  applications: storage(APPLICATION_SCHEMA),
  shortcuts: storage(SHORTCUTS_SCHEMA),
  screens: storage(SCREENS_SCHEMA),
  extensions: storage(EXTENSIONS_SCHEMA),
});

export default preventStateRehydration(reducer);
