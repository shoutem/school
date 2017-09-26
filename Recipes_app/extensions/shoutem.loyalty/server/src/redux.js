import _ from 'lodash';
import { createScopedReducer } from '@shoutem/redux-api-sdk';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { create, storage, getCollection, collection } from '@shoutem/redux-io';
import rulesReducer, { moduleName as rules, createRule } from './modules/rules';
import cashiersReducer, { moduleName as cashiers } from './modules/cashiers';
import cmsReducer, { moduleName as cms, loadResources } from './modules/cms';
import rewardsReducer, { moduleName as rewards } from './modules/rewards';
import { getLoyaltyUrl } from './services';
import ext from './const';

// CONST
export const PROGRAMS = ext('programs');
export const AUTHORIZATIONS = ext('authorizations');
export const PLACES = ext('places');
export const PLACE_REWARDS = ext('place-rewards');

// SELECTORS
export function getFormState(state) {
  return _.get(state, [ext(), 'form']);
}

export function getLoyaltyPlaces(extensionState, state) {
  const loyaltyPlaces = _.get(extensionState, 'loyalty.places');
  return getCollection(loyaltyPlaces, state);
}

// ACTIONS
function createProgram(scope) {
  const config = {
    schema: PROGRAMS,
    request: {
      endpoint: getLoyaltyUrl('/v1/programs'),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newProgram = {
    type: PROGRAMS,
    attributes: {
      name: 'Program',
    },
  };

  return create(config, newProgram, scope);
}

function createAuthorization(programId, authorizationType = 'pin', scope) {
  const config = {
    schema: AUTHORIZATIONS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/authorizations`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const authorization = {
    type: AUTHORIZATIONS,
    attributes: {
      authorizationType,
      implementationData: {},
    },
  };

  return create(config, authorization, scope);
}

export function enableLoyalty(ruleTemplates, authorizationTypes = ['pin', 'userId'], scope) {
  return dispatch => (
    dispatch(createProgram(scope))
      .then(action => {
        const programId = _.get(action, ['payload', 'data', 'id']);

        const ruleActions = _.map(ruleTemplates, rule => (
          dispatch(createRule(rule, programId, null, scope))
        ));

        const authActions = _.map(authorizationTypes, authType => (
          dispatch(createAuthorization(programId, authType, scope))
        ));

        return Promise.all([
          ...authActions,
          ...ruleActions,
        ]).then(() => programId);
      })
  );
}

export function loadLoyaltyPlaces(appId, categoryId, scope) {
  return loadResources(appId, categoryId, PLACES, {}, PLACES, scope);
}

export function navigateToExtension(appId, installationId) {
  const options = { appId, installationId };

  return {
    type: '@@navigator/NAVIGATE_REQUEST',
    payload: {
      component: 'extension',
      options,
    },
  };
}

export default () => (
  createScopedReducer({
    extension: {
      form: formReducer,
      [rules]: rulesReducer,
      [cashiers]: cashiersReducer,
      [cms]: cmsReducer,
      loyalty: combineReducers({
        places: collection(PLACES, PLACES),
      }),
      storage: combineReducers({
        [PLACES]: storage(PLACES),
        [PLACE_REWARDS]: storage(PLACE_REWARDS),
      }),
    },
    shortcut: {
      [rewards]: rewardsReducer,
    },
  })
);
