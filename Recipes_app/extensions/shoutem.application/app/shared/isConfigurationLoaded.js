import { getConfiguration } from '../redux';
import { isInitialized } from '@shoutem/redux-io';

/**
 * Returns true if "complete" configuration is loaded into the state.
 *
 * @param state
 * @returns {boolean}
 */
export function isConfigurationLoaded(state) {
  const configuration = getConfiguration(state);
  return configuration && isInitialized(configuration);
}

