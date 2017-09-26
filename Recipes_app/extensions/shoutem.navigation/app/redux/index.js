import { combineReducers } from 'redux';
import { preventStateRehydration } from '@shoutem/core/preventStateRehydration';
import tabBar, {
  TAB_BAR_NAVIGATION_STACK,

  getTabNavigationStack,
  getTabNavigationStateFromTabBarState,
  getTabNavigationState,

  jumpToInitialTabBarTab,

  jumpToInitialTabMiddleware,
} from './tabBar';
import drawer from './drawer';
import modal, {
  MODAL_NAVIGATION_STACK,
  SAVE_PREVIOUS_STACK,

  openModalMiddleware,
  closeModalMiddleware,
} from './modal';

const reducer = combineReducers({
  tabBar,
  drawer,
  modal,
});
export default preventStateRehydration(reducer);

export {
  TAB_BAR_NAVIGATION_STACK,

  getTabNavigationStack,
  getTabNavigationStateFromTabBarState,
  getTabNavigationState,

  jumpToInitialTabBarTab,
};

export {
  DRAWER_NAVIGATION_STACK,
} from './drawer';

export {
  MODAL_NAVIGATION_STACK,
  SAVE_PREVIOUS_STACK,
};

export const middleware = [
  openModalMiddleware,
  closeModalMiddleware,
  jumpToInitialTabMiddleware,
];
