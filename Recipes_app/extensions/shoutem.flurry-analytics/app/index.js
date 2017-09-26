// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import * as extension from './extension.js';
import { appDidMount } from './app';
import middleware from './middleware';

export {
    appDidMount,
    middleware
}
export const screens = extension.screens;
export const themes = extension.themes;
