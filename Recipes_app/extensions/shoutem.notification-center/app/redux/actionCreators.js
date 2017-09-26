import { SELECT_PUSH_NOTIFICATION_GROUPS } from 'shoutem.push-notifications';

import { RSAA } from 'redux-api-middleware';
import { find } from '@shoutem/redux-io';
import { ext } from '../const';

import {
  MARK_AS_READ_REQUEST,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ_ERROR,

} from './actionTypes';

import getEndpointProvider from '../EndpointProvider';

export const GROUPS_SCHEMA = `${ext()}.groups`;
export const SELECTED_GROUPS_SCHEMA = `${ext()}.selectedGroups`;
export const NOTIFICATIONS_SCHEMA = `${ext()}.notifications`;

export function markAsRead({ id }) {
  const body = JSON.stringify({ ids: [id] });
  return {
    [RSAA]: {
      endpoint: getEndpointProvider().markAsRead,
      method: 'POST',
      body,
      types: [
        {
          type: MARK_AS_READ_REQUEST,
          meta: {
            id,
          },
        },
        {
          type: MARK_AS_READ_SUCCESS,
          meta: {
            id,
          },
        },
        {
          type: MARK_AS_READ_ERROR,
          meta: {
            id,
          },
        },
      ],
    },
  };
}

export function fetchNotifications() {
  return find(NOTIFICATIONS_SCHEMA);
}

export function fetchGroups() {
  return find(GROUPS_SCHEMA);
}

export function fetchSelectedGroups() {
  return (dispatch, getState) => {
    const deviceToken = getState()[ext()].deviceToken;
    dispatch(find(SELECTED_GROUPS_SCHEMA, '', { deviceToken }));
  };
}

/**
 * @see SELECT_PUSH_NOTIFICATION_GROUPS
 * Used for triggering push notification group subscription
 * @param added - notification groups which need to be added to subscribed groups
 * @param removed - notification groups which need to be removed from subscribed groups
 * @returns {{type: String, payload: {added: [], removed: []}}}
 */
export function selectPushNotificationGroups({ added, removed }) {
  return {
    type: SELECT_PUSH_NOTIFICATION_GROUPS,
    payload: {
      added,
      removed,
    },
  };
}
