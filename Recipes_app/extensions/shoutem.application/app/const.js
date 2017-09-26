// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const CONFIGURATION_SCHEMA = 'shoutem.core.configuration';
export const APPLICATION_SCHEMA = 'shoutem.core.application';
export const SHORTCUTS_SCHEMA = 'shoutem.core.shortcuts';
export const EXTENSIONS_SCHEMA = 'shoutem.core.extensions';
export const SCREENS_SCHEMA = 'shoutem.core.screens';
export const CONFIGURATION_TAG = 'configuration';
export const ACTIVE_APP_STATE = 'active';
