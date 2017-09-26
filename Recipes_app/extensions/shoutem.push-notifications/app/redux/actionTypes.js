/**
 * @namespace PushNotificationActionTypes
 * Redux action types dispatched by Shoutem push notifications and its implementations.
 *

/**
 @typedef SELECT_PUSH_NOTIFICATION_GROUPS
 @type {object}
 @property payload {added: [], removed: []} Data
 */
export const SELECT_PUSH_NOTIFICATION_GROUPS = 'shoutem.push-notifications.SELECT_GROUPS';

/**
 @typedef NOTIFICATION_RECEIVED
 @type {object}
 @property body {action_type: , action_params: } Data
 */
export const NOTIFICATION_RECEIVED = 'shoutem.push-notifications.NOTIFICATION_RECEIVED';

/**
 @typedef USER_NOTIFIED
 @type {object}
 */
export const USER_NOTIFIED = 'shoutem.push-notifications.USER_NOTIFIED';

/**
 @typedef REQUEST_PUSH_PERMISSION
 @type {object}
 */
export const REQUEST_PUSH_PERMISSION = 'shoutem.push-notifications.REQUEST_PUSH_PERMISSION';

/**
 @typedef DEVICE_TOKEN_RECEIVED
 @type {object}
 @property type String
 @property token String
 */
export const DEVICE_TOKEN_RECEIVED = 'shoutem.push-notifications.DEVICE_TOKEN_RECEIVED';
