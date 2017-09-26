// Reference for app/index.js can be found here:
// http://shoutem.github.io/docs/extensions/reference/extension-exports

import * as extension from './extension.js';
import rio, { storage, collection } from '@shoutem/redux-io';
import createSchemaConfig from './services/createICalSchemaConfig';
import reducer from './redux';

export const screens = extension.screens;
export const themes = extension.themes;

export function appDidMount() {
  // Configure the events proxy schema in RIO
  rio.registerSchema(createSchemaConfig());
}

export { reducer };
