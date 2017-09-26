import rio from '@shoutem/redux-io';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import URI from 'urijs';

import {
  USER_SCHEMA,
  USER_CREDENTIALS_SCHEMA,
  USER_FACEBOOK_CREDENTIALS_SCHEMA,
  USER_PROFILE_SCHEMA,
  USER_PROFILE_IMAGE_SCHEMA,
  RESTORE_SESSION,
} from './redux';

import { getSession } from './session';

const APPLICATION_EXTENSION = 'shoutem.application';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const { dispatch } = store;

  const appId = getAppId();

  const apiEndpoint = getExtensionSettings(state, APPLICATION_EXTENSION).legacyApiEndpoint;

  const apiRequestOptions = {
    resourceType: 'JSON',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  function createAccountApiEndpoint(path, queryStringParams) {
    const endpoint = new URI(`${apiEndpoint}/api/account/${path}`);

    return endpoint
      .protocol('https')
      .query(`${queryStringParams}&nid=${appId}`)
      .readable();
  }

  rio.registerSchema({
    schema: USER_SCHEMA,
    request: {
      endpoint: createAccountApiEndpoint(
        'signup.json',
        'email={email}&username={username}&password={password}',
      ),
      method: 'POST',
      ...apiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: USER_CREDENTIALS_SCHEMA,
    request: {
      endpoint: createAccountApiEndpoint(
        'verify_credentials.json',
        'email={email}&password={password}',
      ),
      ...apiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: USER_FACEBOOK_CREDENTIALS_SCHEMA,
    request: {
      endpoint: createAccountApiEndpoint(
        'verify_facebook_credentials.json',
        'access_token={accessToken}&auto_register=true&update_shoutem_profile=false',
      ),
      ...apiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: USER_PROFILE_SCHEMA,
    request: {
      endpoint: createAccountApiEndpoint('update_profile.json'),
      method: 'POST',
      ...apiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: USER_PROFILE_IMAGE_SCHEMA,
    request: {
      endpoint: createAccountApiEndpoint('update_profile_image.json'),
      method: 'POST',
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });

  return getSession().then(
    session => session && dispatch({
      type: RESTORE_SESSION,
      payload: JSON.parse(session),
    }),
  );
}
