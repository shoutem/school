import { getOne } from '@shoutem/redux-io';
import _ from 'lodash';

/**
 * Get Google Analytics trackers from extension settings.
 * @param extensionName {string}
 * @param app {object}
 * @returns {V}
 */
export function getGoogleAnalyticsTrackers(extensionName, app) {
  const store = app.getStore();
  const state = store.getState();
  const GAExt = getOne(extensionName, state, 'shoutem.core.extensions');
  return _.get(GAExt, 'settings.trackers');
}
