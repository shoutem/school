import * as _ from 'lodash';
import {
  createNavigationAction,
  isNavigationAction,
} from '@shoutem/core/navigation';
import { EXECUTE_SHORTCUT, getShortcut, getActiveShortcut } from './redux';
import { priorities, setPriority } from '@shoutem/core/middlewareUtils';
import { LOAD_REQUEST } from '@shoutem/redux-io';
import { Alert } from 'react-native';

function createExecuteShortcutActionMiddleware(actions) {
  const middleware = store => next => action => {
    if (action.type === EXECUTE_SHORTCUT) {
      const state = store.getState();
      const shortcut = getShortcut(state, action.shortcutId);
      const actionName = shortcut.action;

      if (!actionName) {
        return next(action);
      }

      const shortcutAction = actions[actionName];

      if (typeof shortcutAction === 'function') {
        return store.dispatch(shortcutAction(state, action));
      }

      throw new Error(`Shortcut you tried to execute has no valid action (${actionName}), ` +
        'or you tried to execute shortcut before appDidMount. Check exports of your extension.');
    }

    return next(action);
  };

  setPriority(middleware, priorities.NAVIGATION);
  return middleware;
}

// eslint-disable-next-line no-unused-vars
// TODO (zeljko): Move this to shoutem.layouts?
const resolveScreenLayout = store => next => action => {
  if (isNavigationAction(action) && action.route) {
    const routeShortcutId = _.get(action, 'route.context.shortcutId');
    const state = store.getState();
    const activeShortcut = routeShortcutId ?
      getShortcut(state, routeShortcutId) :
      getActiveShortcut(state);

    if (!activeShortcut) {
      return next(action);
    }

    const screenLayout = _.find(activeShortcut.screens, { canonicalType: action.route.screen });
    if (screenLayout) {
      const newAction = { ...action };
      newAction.route.screen = screenLayout.canonicalName;
      newAction.route.props = {
        // Each screen will get:
        // 1. any props specified directly in the navigation action,
        // 2. any screen settings defined by the user through the settings page,
        // 3. the currently active shortcut.
        // 4. the default screen title (from the shortcut)
        title: activeShortcut.title,
        shortcut: activeShortcut,
        ...screenLayout.settings,
        ...action.route.props,
      };
      newAction.route.context = {
        ...action.route.context,
        // Make sure that the shortcut we actually used
        // to resolve everything ends up in the context.
        shortcutId: activeShortcut.id,
      };

      return next(newAction);
    }
  }

  return next(action);
};
setPriority(resolveScreenLayout, priorities.NAVIGATION);

// eslint-disable-next-line no-unused-vars
const navigateToShortcutScreen = store => next => action => {
  if (action.type === EXECUTE_SHORTCUT) {
    const shortcut = getShortcut(store.getState(), action.shortcutId);

    // Canonical screen name, used to get screen component
    const screen = shortcut.screen;
    // Route title
    const title = shortcut.title;

    if (screen) {
      const route = {
        screen,
        title,
        props: {
          // Layout specific settings will be added here when
          // the layout is resolved (@see resolveScreenLayout middleware).
        },
        context: {
          shortcutId: shortcut.id,
        },
      };

      const { navigationAction, navigationStack } = action;

      store.dispatch(createNavigationAction(navigationAction, route, navigationStack));
    }
  }

  return next(action);
};
setPriority(navigateToShortcutScreen, priorities.NAVIGATION);

/**
 * Injects shortcutId to route context for navigation actions which belongs to shortcut.
 * Preserves shortcutId in the route context for actions that doesn't open new shortcut.
 * @param store
 */
const injectShortcutIdToActionRouteContext = store => next => action => {
  if (action.route && !_.get(action.route, 'context.shortcutId') && isNavigationAction(action)) {
    // if action already has shortcutId it is action that opens new shortcut
    const activeShortcut = getActiveShortcut(store.getState()) || {};
    _.set(action.route, 'context.shortcutId', activeShortcut.id);
  }
  return next(action);
};
setPriority(injectShortcutIdToActionRouteContext, priorities.NAVIGATION);


const alertNoInternet = _.throttle(
  () => Alert.alert('Network error', 'No internet connection, please check your network.'),
  15 * 1000,
  { leading: true, trailing: false }
);

// eslint-disable-next-line no-unused-vars
const noInternetMiddleware = store => next => action => {
  if (action.type === LOAD_REQUEST && action.error) {
    alertNoInternet();
  }
  return next(action);
};

export {
  noInternetMiddleware,
  resolveScreenLayout,
  navigateToShortcutScreen,
  createExecuteShortcutActionMiddleware,
  injectShortcutIdToActionRouteContext,
};
