import _ from 'lodash';

/**
 * @namespace AnalyticsActionTypes
 * Redux action types that Shoutem analytics dispatch.
 *
 * @typedef payload
 * @abstract
 * @description Additional data added to analytics actions
 *
 * @variation Application payload
 *  Added to every analytics action {@see injectApplicationDataToAnalyticsAction}
 * @property screen {string} Current screen canonical name
 * @property extension {string} Extension providing screen
 * @property shortcut {object} Current shortcut
 * @property appId {number}
 */

/**
 @typedef SCREEN_VIEW
 @type {object}
 @property type {string} Redux action type
 @property title {string} Event category
 @property payload {object} (optional) Data
 */
export const SCREEN_VIEW = 'shoutem.analytics.SCREEN_VIEW';

/**
 @typedef EVENT
 @type {object}
 @property type {string} Redux action type
 @property resource {string} Resource (type) on which action is performed
 @property action {string} The type of interaction
 @property payload {object} (optional) Data
 */
export const EVENT = 'shoutem.analytics.EVENT';

const actionTypesSet = new Set();
actionTypesSet.add(EVENT);
actionTypesSet.add(SCREEN_VIEW);

export function isAnalyticsAction(action) {
  return actionTypesSet.has(action.type);
}

export function isEventAction(action) {
  return action.type === EVENT;
}

export function isScreenViewAction(action) {
  return action.type === SCREEN_VIEW;
}

function createAnalyticsAction(action) {
  const actionPayload = action.payload;
  if (!_.isPlainObject(actionPayload)) {
    throw Error(
      `Analytics action payload must be object, ${typeof actionPayload} provided. ` +
      `Action: ${JSON.stringify(action)}`
    );
  }
  return action;
}

/**
 * Route title may differ from Screen title.
 * Route title is set by navigating component in navigation action
 * while Screen title is set by Screen.
 * Use shortcut to provide more context to the route.
 * @see SCREEN_VIEW
 * @param title {string} Screen view title
 * @param payload {object} (optional) Data
 * @returns {{type, action}}
 */
export const triggerScreenView = (title, payload = {}) => createAnalyticsAction({
  type: SCREEN_VIEW,
  title,
  payload,
});

/**
 * Additionally, screenView object will be injected {@see injectScreenViewToAnalyticsEventAction}
 * into event action containing same properties as in {@see triggerScreenView}.
 * @see EVENT
 * @param resource {string} Resource on which action is performed
 * @param action {string} The type of interaction
 * @param payload {object} (optional) Data
 * @returns {{type, action}}
 */
export const triggerEvent = (resource, action, payload = {}) => createAnalyticsAction({
  type: EVENT,
  resource,
  action,
  payload,
});
