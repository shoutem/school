import _ from 'lodash';
import rio from '@shoutem/redux-io';
import { getExtensionSettings } from 'shoutem.application';

import {
  ext,
  AUTHORIZATIONS_SCHEMA,
  CARD_SCHEMA,
  CARD_STATE_SCHEMA,
  CASHIERS_SCHEMA,
  PUNCH_REWARDS_SCHEMA,
  POINT_REWARDS_SCHEMA,
  RULES_SCHEMA,
  TRANSACTIONS_SCHEMA,
} from './const';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();

  const { apiEndpoint, program } = getExtensionSettings(state, ext());
  const programId = _.get(program, 'id');

  const programEndpoint = `http://${apiEndpoint}/v1/programs/${programId}`;

  const jsonApiRequestOptions = {
    headers: {
      Accept: 'application/vnd.api+json',
    },
  };

  rio.registerSchema({
    schema: CARD_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/cards/{user}`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: CARD_STATE_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/cards/{cardId}/state?filter[cardType]=point`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: CASHIERS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/cashiers/user:{userId}`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: AUTHORIZATIONS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/authorizations/verify`,
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  });

  rio.registerSchema({
    schema: PUNCH_REWARDS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/rewards/punch`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: POINT_REWARDS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/rewards/point`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: RULES_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/rules`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: TRANSACTIONS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/transactions`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: TRANSACTIONS_SCHEMA,
    request: {
      endpoint: `${programEndpoint}/transactions`,
      ...jsonApiRequestOptions,
    },
  });
}
