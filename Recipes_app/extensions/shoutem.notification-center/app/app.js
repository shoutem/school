import _ from 'lodash';
import rio from '@shoutem/redux-io';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import getEndpointProvider, {
  initialize,
} from './EndpointProvider';

import {
  fetchGroups,
  GROUPS_SCHEMA,
  NOTIFICATIONS_SCHEMA,
  SELECTED_GROUPS_SCHEMA,
} from './redux';

const APPLICATION_EXTENSION = 'shoutem.application';

const apiRequestOptions = {
  resourceType: 'JSON',
  headers: {
    'Content-Type': 'application/json',
  },
};

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const appId = getAppId();
  const extensionSettings = getExtensionSettings(state, APPLICATION_EXTENSION);
  const legacyApiEndpoint = _.get(extensionSettings, 'legacyApiEndpoint');

  if (!legacyApiEndpoint) {
    throw new Error(
      `Legacy api endpoint not configured. Check the ${APPLICATION_EXTENSION} extension settings.`,
    );
  }

  initialize(legacyApiEndpoint, appId);

  rio.registerSchema({
    schema: NOTIFICATIONS_SCHEMA,
    request: {
      endpoint: getEndpointProvider().inbox,
      ...apiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: GROUPS_SCHEMA,
    request: {
      endpoint: getEndpointProvider().groups,
      ...apiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: SELECTED_GROUPS_SCHEMA,
    request: {
      endpoint: getEndpointProvider().selectedGroups,
      ...apiRequestOptions,
    },
  });

  const { dispatch } = store;

  dispatch(fetchGroups());
}
