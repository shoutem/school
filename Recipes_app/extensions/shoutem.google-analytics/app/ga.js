import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

const {
  trackScreenView,
  trackScreenViewWithCustomDimensionValues,
  trackEvent,
  trackEventWithCustomDimensionValues,
} = GoogleAnalyticsTracker.prototype;

function createTracker(trackerConfig) {
  if (!trackerConfig.trackerId) {
    console.warn('Trying to create tracker with invalid trackerId.');
    return undefined;
  }

  const tracker = new GoogleAnalyticsTracker(
    trackerConfig.trackerId,
    // Empty map will strip all custom dimensions, if the
    // mapping is not configured on the server side. We want
    // to do this because we are sending the dimension keys as
    // user readable strings, instead of sending indexes that
    // GA tracker expects.
    trackerConfig.customDimensionsFieldIndexMap || {}
  );

  if (trackerConfig.samplingRate) {
    tracker.setSamplingRate(trackerConfig.samplingRate);
  }

  return tracker;
}

/**
 * Google analytics service push same analytics to all registered trackers.
 * You can register multiple trackers which should be configured when instancing.
 * Optionally you can get specific tracker and configure it in the run time.
 * GoogleAnalyticsService pass Google Analytics methods calls to registered trackers.
 */
export class GoogleAnalyticsService {
  constructor() {
    this.createAndAddTracker = this.createAndAddTracker.bind(this);
    this.trackers = [];
  }
  /**
   * Add new tracker instance for given tracker configuration.
   * @param {{ sampleRate, appId, trackerId }} trackerConfig
   * return {GoogleAnalyticsTracker}
   */
  createAndAddTracker(trackerConfig) {
    try {
      const tracker = createTracker(trackerConfig);
      this.trackers.push(tracker);
      return tracker;
    } catch (e) {
      console.warn('Failed to initialize tracker with config:', trackerConfig);
    }
  }

  /**
   * Create and add trackers.
   * @param {Array} trackers Array of trackerConfig {@see createAndAddTracker}
   */
  createAndAddTrackers(trackers) {
    trackers.map(this.createAndAddTracker);
  }

  /**
   * Remove tracker from tracker array by ID.
   * @param {String} trackerId
   */
  removeTracker(trackerId) {
    const trackerIndex = this.trackers.findIndex(tracker => tracker.id === trackerId);
    delete this.trackers[trackerIndex];
  }

  /**
   * Get tracker instance by Id.
   * @param trackerId
   * @returns {GoogleAnalyticsTracker || undefined}
   */
  getTracker(trackerId) {
    return this.trackers.find(tracker => tracker.id === trackerId);
  }

  /**
   * Call tracker analytics method on all registered trackers.
   * @param method {Function}
   * @param args {Array}
   */
  callTrackersMethod(method, ...args) {
    this.trackers.forEach(tracker => method.call(tracker, ...args));
  }

  /*
    Currently supported Google Analytics Tracker methods.
    In future, add more proxy methods here as needed.
    Function documentation can be found at
    {@link https://github.com/idehub/react-native-google-analytics-bridge}
   */

  /* eslint-disable prefer-rest-params, no-unused-vars */

  trackScreenView(screenName) {
    this.callTrackersMethod(trackScreenView, ...arguments);
  }

  trackScreenViewWithCustomDimensionValues(screenName, customDimensions) {
    this.callTrackersMethod(trackScreenViewWithCustomDimensionValues, ...arguments);
  }

  trackEvent(category, action, optionalValues = {}) {
    this.callTrackersMethod(trackEvent, ...arguments);
  }

  trackEventWithCustomDimensionValues(category, action, optionalValues = {}, customDimensions) {
    this.callTrackersMethod(trackEventWithCustomDimensionValues, ...arguments);
  }

  /* eslint-enable prefer-rest-params, no-unused-vars */
}

export const googleAnalytics = new GoogleAnalyticsService();
