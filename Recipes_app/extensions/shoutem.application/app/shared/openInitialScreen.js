import { executeShortcut } from '../redux';
import { getFirstShortcut } from './getFirstShortcut';

export const openInitialScreen = (app) => {
  const store = app.getStore();
  const state = store.getState();
  const firstShortcut = getFirstShortcut(state);
  if (firstShortcut) {
    // Initial navigation action has some constraints on the navigation actions,
    // @see initialNavigationReducer in shoutem-core/navigation
    store.dispatch(executeShortcut(firstShortcut.id));
  }
};
