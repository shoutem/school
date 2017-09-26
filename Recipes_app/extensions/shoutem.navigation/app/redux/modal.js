import { InteractionManager } from 'react-native';
import { combineReducers } from 'redux';

import {
  ROOT_NAVIGATION_STACK,
  EMPTY_ROUTE,
  OPEN_MODAL,
  CLOSE_MODAL,

  createNavigationReducer,

  navigateTo,
  getActiveNavigationStack,
  setActiveNavigationStack,
  navigateBack,
  reset,
} from '@shoutem/core/navigation';

import { ext } from '../const';

const MODAL_SCREEN = 'shoutem.navigation.Modal';

export const MODAL_NAVIGATION_STACK = {
  name: ext('Modal'),
  statePath: [ext(), 'modal', 'navigation'],
};

//
// Actions
//

/**
 * Saves the previous navigation stack
 * @typedef SAVE_PREVIOUS_STACK
 * @type {object}
 * @property payload {} Previous navigation stack.
 */
export const SAVE_PREVIOUS_STACK = 'shoutem.navigation.SAVE_PREVIOUS_STACK';

/**
 * @see SAVE_PREVIOUS_STACK
 * Saves the previous active stack in the state.
 * @param previousStack - Previous stack
 * @returns {{ type: String, stack: {} }}
 */
export const savePreviousStack = previousStack => ({
  type: SAVE_PREVIOUS_STACK,
  stack: previousStack,
});

//
// Middleware
//

/**
 * Opens a modal by pushing the Modal screen to the ROOT_NAVIGATION_STACK.
 * When modal is ready to display content, an arbitrary action specified in payload
 * is dispatched.
 * @param store
 */
export const openModalMiddleware = store => next => (action) => {
  if (action.type === OPEN_MODAL) {
    const { route } = action;
    const previousStack = getActiveNavigationStack(store.getState());
    const { dispatch } = store;

    dispatch(savePreviousStack(previousStack));
    dispatch(reset(route, MODAL_NAVIGATION_STACK));
    dispatch(navigateTo({ screen: MODAL_SCREEN }, ROOT_NAVIGATION_STACK));
    dispatch(setActiveNavigationStack(MODAL_NAVIGATION_STACK));
  }

  return next(action);
};

/**
 * Closes the active modal
 * @param store
 */
export const closeModalMiddleware = store => next => (action) => {
  if (action.type === CLOSE_MODAL) {
    const { previousStack } = store.getState()[ext()].modal;
    const { dispatch } = store;

    dispatch(setActiveNavigationStack(previousStack));
    dispatch(navigateBack(ROOT_NAVIGATION_STACK));

    InteractionManager.runAfterInteractions(() => {
      dispatch(reset(EMPTY_ROUTE, MODAL_NAVIGATION_STACK));
    });
  }

  return next(action);
};

//
// Reducers
//

const previousStack = (state = {}, action) => {
  if (action.type === SAVE_PREVIOUS_STACK) {
    return { ...action.stack };
  }
  return state;
};

const reducer = combineReducers({
  navigation: createNavigationReducer(MODAL_NAVIGATION_STACK.name),
  previousStack,
});
export default reducer;
