import rio from '@shoutem/redux-io';
import { getAppId, getExtensionSettings } from 'shoutem.application';

import {
  CATEGORIES_SCHEMA,
} from './redux';

import { ext } from './const';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const appId = getAppId();
  const apiEndpoint = getExtensionSettings(state, ext()).apiEndpoint;
  if (!apiEndpoint) {
    throw new Error(
      'CMS api endpoint not configured. Check the CMS extension settings in the builder.'
    );
  }

  const jsonApiRequestOptions = {
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
  };

  rio.registerSchema({
    schema: CATEGORIES_SCHEMA,
    request: {
      endpoint: `${apiEndpoint}/v1/apps/${appId}/categories`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema((schemaName) => ({
    schema: schemaName,
    request: {
      endpoint: `${apiEndpoint}/v1/apps/${appId}/resources/${schemaName}`,
      ...jsonApiRequestOptions,
    },
  }));
}
