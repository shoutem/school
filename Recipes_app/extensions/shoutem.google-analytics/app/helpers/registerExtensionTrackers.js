import _ from 'lodash';
import { getGoogleAnalyticsTrackers } from './getGoogleAnalyticsTrackers';
import { googleAnalytics } from '../ga';

/**
 * Register extension GA trackers to shared Google Analytics instance.
 * @param extensionName {string}
 * @param app {object}
 */
export function registerExtensionTrackers(extensionName, app) {
  const trackers = getGoogleAnalyticsTrackers(extensionName, app);
  if (_.size(trackers) > 0) {
    googleAnalytics.createAndAddTrackers(trackers);
  }
}
