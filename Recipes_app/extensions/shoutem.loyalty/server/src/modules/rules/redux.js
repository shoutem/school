import _ from 'lodash';
import { combineReducers } from 'redux';
import {
  cloneStatus,
  find,
  create,
  update,
  getCollection,
  storage,
  collection,
  remove,
} from '@shoutem/redux-io';
import { createSelector } from 'reselect';
import { getLoyaltyUrl } from '../../services';
import ext from '../../const';
import {
  getRulesToCreate,
  getRulesToDelete,
  getRulesToUpdate,
} from './services';

// CONST
export const moduleName = 'rules';
export const RULES = 'shoutem.loyalty.rules';

// SELECTORS
export function getRulesState(state) {
  return state[ext()][moduleName];
}

export function getRules(state) {
  const rules = getRulesState(state).current;
  return getCollection(rules, state);
}

export const getRulesById = createSelector(
  getRules,
  rules => {
    const keyedById = _.keyBy(rules, 'id');
    cloneStatus(rules, keyedById);
    return keyedById;
  }
);

// ACTIONS
export function loadRules(programId, placeId, scope = {}) {
  const params = {
    q: {
      'filter[location]': placeId || 'null',
    },
    ...scope,
  };

  const config = {
    schema: RULES,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/rules{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('rules'), params);
}

export function createRule(rule, programId, placeId, scope = {}) {
  const config = {
    schema: RULES,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/rules`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newRule = {
    type: RULES,
    attributes: {
      ...rule,
      location: placeId,
    },
  };

  return create(config, newRule, scope);
}

export function createRules(ruleTemplates, programId, placeId, scope) {
  return dispatch => {
    const actions = _.map(ruleTemplates, rule => (
      createRule(rule, programId, placeId, scope)
    ));

    return Promise.all(_.map(actions, dispatch));
  };
}

export function updateRule(ruleId, rulePatch, programId, scope = {}) {
  const config = {
    schema: RULES,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/rules/${ruleId}`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const rule = {
    type: RULES,
    id: ruleId,
    attributes: {
      ...rulePatch,
    },
  };

  return update(config, rule, scope);
}

export function deleteRule(ruleId, programId, scope = {}) {
  const config = {
    schema: RULES,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/rules/${ruleId}`),
      headers: {},
    },
  };

  const rule = { type: RULES, id: ruleId };
  return remove(config, rule, scope);
}

export function deleteRules(rules, programId, scope) {
  return dispatch => {
    const actions = _.map(rules, rule => (
      deleteRule(rule.id, programId, scope)
    ));

    return Promise.all(_.map(actions, dispatch));
  };
}

export function updateRules(initialRules, newRules, programId, placeId, scope) {
  return (dispatch) => {
    const deleteActions = _.map(getRulesToDelete(newRules), rule => (
      dispatch(deleteRule(rule.id, programId, scope))
    ));

    const updateActions = _.map(getRulesToUpdate(initialRules, newRules), rule => (
      dispatch(updateRule(rule.id, rule, programId, scope))
    ));

    const createActions = _.map(getRulesToCreate(newRules), rule => (
      dispatch(createRule(rule, programId, placeId, scope))
    ));

    return Promise.all([
      ...deleteActions,
      ...updateActions,
      ...createActions,
    ]);
  };
}

// REDUCER
export const reducer = combineReducers({
  storage: storage(RULES),
  current: collection(RULES, ext('rules')),
});
