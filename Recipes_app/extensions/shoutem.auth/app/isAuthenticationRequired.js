import _ from 'lodash';
import { getExtensionSettings, getActiveShortcut } from 'shoutem.application';
import { ext } from './const.js';

// function that takes 2 parameters
// screens - map of screens installed in users application
// action - next action that needs to be executed
// function is used in middleware and takes only action type NAVIGATE
// it first find destination screen for the navigation action
// then it checks if destination screen is decorated with loginRequired property

function isActiveShortcutProtected(state, action) {
  const activeShortcut = getActiveShortcut(state, action);
  const settings = getExtensionSettings(state, ext());

  if (settings.allScreensProtected) {
    return true;
  }

  return _.get(activeShortcut, 'settings.shoutemAuth.protected', false);
}

export function isAuthenticationRequired(screens = {}, action, state) {
  if (action.route) {
    const screenName = action.route.screen;
    const screen = screens[screenName];
    if (!screen) {
      console.warn('Attempting to determine the authentication requirements ' +
        `for an invalid screen: ${screenName}`);
      return false;
    }

    // The screen is explicitly marked as public, this is useful
    // for screens that must never be behind a login, for example
    // register screen.
    if (screen.loginRequired === false) {
      return false;
    }

    return screen.loginRequired || isActiveShortcutProtected(state, action);
  }
  return false;
}
