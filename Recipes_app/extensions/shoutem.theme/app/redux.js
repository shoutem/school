import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { getConfiguration, isConfigurationLoaded } from 'shoutem.application';
import { THEMES_SCHEMA } from './const';

/**
 * A selector that returns active theme from configuration.
 * @param state
 * @returns {V}
 */
export const getActiveTheme = function (state) {
  const configuration = getConfiguration(state);
  const activeTheme = configuration.activeTheme || configuration.defaultTheme;
  if (!activeTheme && isConfigurationLoaded(state)) {
    throw Error('Neither active or default theme provided in configuration.');
  }
  return activeTheme;
};

/**
 * A selector that returns default theme from configuration.
 * @param state
 * @returns {V}
 */
export const getDefaultTheme = function (state) {
  return getConfiguration(state).defaultTheme;
};


// create reducer with wanted default configuration
export default combineReducers({
  themes: storage(THEMES_SCHEMA),
});
