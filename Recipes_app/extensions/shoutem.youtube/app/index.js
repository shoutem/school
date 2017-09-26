// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import * as extension from './extension';
import reducer from './redux';
import { appDidMount } from './app';

export const screens = extension.screens;

export { reducer };

export {
  appDidMount,
};
