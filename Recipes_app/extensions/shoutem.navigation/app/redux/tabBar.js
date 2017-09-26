import _ from 'lodash';
import { combineReducers } from 'redux';
import { mapReducers } from '@shoutem/redux-composers';

import {
  createNavigationReducer,
  setActiveNavigationStack,
  jumpToKey,
} from '@shoutem/core/navigation';

import { ext } from '../const';

//
// Actions
//

export const JUMP_TO_INITIAL_TAB = 'shoutem.navigation.JUMP_TO_INITIAL_TAB';

// Jump to initial tab within the TabBar
export const jumpToInitialTabBarTab = () => ({
  type: JUMP_TO_INITIAL_TAB,
});

//
// Selectors
//

const TAB_NAVIGATOR_PREFIX = 'tab-';
export const TAB_BAR_NAVIGATION_STACK = {
  name: ext('TabBar'),
  statePath: [ext(), 'tabBar', 'tabBarState'],
};
export const getTabNavigationStack = (tabId) => {
  const name = `${TAB_NAVIGATOR_PREFIX}${tabId}`;
  return {
    name,
    statePath: [ext(), 'tabBar', 'tabStates', name],
  };
};

export const getTabNavigationStateFromTabBarState = (tabBarState, tabId) =>
  tabBarState.tabStates[getTabNavigationStack(tabId).name];

export const getTabNavigationState = (state, tabId) =>
  getTabNavigationStateFromTabBarState(state[ext()].tabBar, tabId);

//
// Middleware
//

const INITIAL_TAB_SHORTCUT_PATH = [
  'shoutem.navigation',
  'tabBar',
  'navigationState',
  'routes',
  0,
  'props',
  'shortcut',
];

/**
 * Jumps to the initial tab contained within the TabBar and sets the appropriate
 * NavigationStack for the same. Since the initial route is always present, we always want
 * to use the jumpToKey method.
 * @param store
 */
export const jumpToInitialTabMiddleware = store => next => (action) => {
  if (action.type === JUMP_TO_INITIAL_TAB) {
    const state = store.getState();
    const initialTabShortcut = _.get(state, INITIAL_TAB_SHORTCUT_PATH);
    const initialTabNavigationStack = getTabNavigationStack(initialTabShortcut.id);
    const stackName = initialTabNavigationStack.name;
    store.dispatch(setActiveNavigationStack(initialTabNavigationStack));
    store.dispatch(jumpToKey(stackName, TAB_BAR_NAVIGATION_STACK));
  }

  return next(action);
};

//
// Reducers
//

// tabBarState represents the main navigation state
const tabBarState = createNavigationReducer(TAB_BAR_NAVIGATION_STACK.name);

// eslint-disable-next-line arrow-body-style
const tabKeySelector = action => {
  const stackName = _.get(action, 'navigationStack.name');
  return _.startsWith(stackName, TAB_NAVIGATOR_PREFIX) ? stackName : undefined;
};
const tabStates = mapReducers(tabKeySelector, createNavigationReducer);

export default combineReducers({
  navigationState: tabBarState,
  tabStates,
});
