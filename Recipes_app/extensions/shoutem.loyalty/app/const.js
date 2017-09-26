// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const CARD_SCHEMA = ext('cards');
export const CARD_STATE_SCHEMA = ext('card-states');
export const CASHIERS_SCHEMA = ext('cashiers');
export const AUTHORIZATIONS_SCHEMA = ext('authorizations');
export const REWARDS_SCHEMA = ext('rewards');
export const CMS_PUNCHCARDS_SCHEMA = ext('punch-cards');
export const PLACES_SCHEMA = ext('places');
export const PLACE_REWARDS_SCHEMA = ext('place-rewards');
export const PUNCH_REWARDS_SCHEMA = ext('punch-rewards');
export const POINT_REWARDS_SCHEMA = ext('point-rewards');
export const RULES_SCHEMA = ext('rules');
export const TRANSACTIONS_SCHEMA = ext('transactions');
