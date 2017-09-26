import reducer from './reducers';
import * as extension from './extension.js';

const { PageScreen } = extension.screens;

export const screens = {
  ...extension.screens,
  ClearNavbarLargePageScreen: PageScreen,
  SolidNavbarLargePageScreen: PageScreen,
  ClearNavbarMediumPageScreen: PageScreen,
  SolidNavbarMediumPageScreen: PageScreen
};

export const themes = extension.themes;

export { reducer };
