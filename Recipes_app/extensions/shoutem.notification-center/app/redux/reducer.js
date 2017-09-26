import _ from 'lodash';
import { combineReducers } from 'redux';

import { DEVICE_TOKEN_RECEIVED, SELECT_PUSH_NOTIFICATION_GROUPS } from 'shoutem.push-notifications';

import { resource } from '@shoutem/redux-io';
import { chainReducers } from '@shoutem/redux-composers';

import {
  GROUPS_SCHEMA,
  NOTIFICATIONS_SCHEMA,
  SELECTED_GROUPS_SCHEMA,
} from './actionCreators';

const deviceToken = (state = '', action) => {
  switch (action.type) {
    case DEVICE_TOKEN_RECEIVED:
      return action.token;
    default:
      return state;
  }
};

const manuallyUnsubscribedGroups = (state = [], action) => {
  switch (action.type) {
    case SELECT_PUSH_NOTIFICATION_GROUPS:
      return _.difference(_.union(state, action.payload.removed), action.payload.added);
    default:
      return state;
  }
};

const selectedGroups = (state = [], action) => {
  switch (action.type) {
    case SELECT_PUSH_NOTIFICATION_GROUPS:
      return _.difference(_.union(state, action.payload.added), action.payload.removed);
    default:
      return state;
  }
};

const selectedGroupsReducers = chainReducers([
  resource(SELECTED_GROUPS_SCHEMA),
  selectedGroups,
]);

export default combineReducers({
  deviceToken,
  inbox: resource(NOTIFICATIONS_SCHEMA),
  groups: resource(GROUPS_SCHEMA),
  manuallyUnsubscribedGroups,
  selectedGroups: selectedGroupsReducers,
});
