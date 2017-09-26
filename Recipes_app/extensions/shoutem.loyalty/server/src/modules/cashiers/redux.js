import { combineReducers } from 'redux';
import {
  find,
  create,
  update,
  remove,
  getCollection,
  storage,
  collection,
  cloneStatus,
} from '@shoutem/redux-io';
import _ from 'lodash';
import { createSelector } from 'reselect';
import { getLoyaltyUrl } from '../../services';
import { getLoyaltyPlaces } from '../../redux';
import ext from '../../const';

// CONST
export const moduleName = 'cashiers';
export const CASHIERS = 'shoutem.loyalty.cashiers';

// SELECTORS
export function getCashiersState(state) {
  return state[ext()][moduleName];
}

export function getCashiers(state) {
  const cashiers = getCashiersState(state).current;
  return getCollection(cashiers, state);
}

export const getCashiersWithPlace = extensionState => createSelector(
  getCashiers,
  state => getLoyaltyPlaces(extensionState, state),
  (cashiers, places) => {
    const cashiersWithPlace = _.map(cashiers, cashier => {
      const place = _.find(places, { id: cashier.location });
      const placeName = _.get(place, 'name', 'All');

      return { ...cashier, placeName };
    });

    cloneStatus(cashiers, cashiersWithPlace);
    return cashiersWithPlace;
  }
);

// ACTIONS
export function loadCashiers(programId, placeId, scope = {}) {
  const params = {
    q: {
      'filter[location]': placeId,
    },
    ...scope,
  };

  const config = {
    schema: CASHIERS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/cashiers{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('cashiers'), params);
}

export function createCashier(cashier, programId, appId, scope = {}) {
  const config = {
    schema: CASHIERS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/cashiers`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newCashier = {
    type: CASHIERS,
    attributes: {
      app: appId,
      ...cashier,
    },
  };

  return create(config, newCashier, scope);
}

export function updateCashier(cashierId, cashierPatch, programId, scope = {}) {
  const config = {
    schema: CASHIERS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/cashiers/${cashierId}`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const cashier = {
    type: CASHIERS,
    id: cashierId,
    attributes: cashierPatch,
  };

  return update(config, cashier, scope);
}

export function deleteCashier(cashierId, programId, scope = {}) {
  const config = {
    schema: CASHIERS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/cashiers/${cashierId}`),
      headers: {},
    },
  };

  const cashier = { type: CASHIERS, id: cashierId };
  return remove(config, cashier, scope);
}

// REDUCER
export const reducer = combineReducers({
  storage: storage(CASHIERS),
  current: collection(CASHIERS, ext('cashiers')),
});
