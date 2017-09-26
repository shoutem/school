import _ from 'lodash';

import { find, clear } from '@shoutem/redux-io';

export const FAVORITES_TAG = 'favorite';

/**
 * A selector that retrieves ids of items from all favorites schemas.
 *
 * @param state {Object} Current redux state containing items ids
 * @returns {[]} An array of item ids.
 */
export function getFavoriteItems(state) {
  return state['shoutem.favorites'].favoriteItems;
}

/**
 * Selects only items ids for a specific favorites schema
 * from current state.
 *
 * @param schema {string} The schema name for favorite items
 * @param state {Object} Redux state containing favorites schemas
 * @returns {[]} An array of favorite items ids.
 */
export function getFavoriteCollection(schema, state) {
  return _.get(state, ['shoutem.favorites', 'favoriteItems', schema]);
}

/**
 * Selects map containing favorites schemas only
 * from current state.
 * TODO (Belma): Extend map with false values for
 * other schemas which are not using favorites.
 *
 * @param state {Object} Redux state containing favorites schemas.
 * @returns {{}} A map of favorites schemas.
 */
export function getFavoritesSchemas(state) {
  return _.get(state, ['shoutem.favorites', 'schemas']);
}

/**
 * Checks if schema is enabled as a favorites schema.
 *
 * @param state {Object} Redux state containing favorites schemas.
 * @param schema {string} Schema name
 * @returns {boolean}
 */
export function isFavoritesSchema(state, schema) {
  return !!_.get(getFavoritesSchemas(state), schema);
}

/**
 * Checks if given item is in favorite state.
 *
 * @param state {Object} Redux state containing favorite items
 * @param schema {string} Schema name
 * @param id {string} Item id
 * @returns {boolean}
 */
export function isFavoriteItem(state, schema, id) {
  return _.some(state['shoutem.favorites'].favoriteItems[schema], { id });
}

/**
 * Action creator for fetching favorite items.
 *
 * @param schema {string} Schema name
 * @param collection {array} Collection of items' ids
 * @param options {Object} Additional options object for find action
 * @returns {*}
 */
export function fetchFavoritesData(schema, collection, options = {}, tag = FAVORITES_TAG) {
  if (_.isEmpty(collection)) {
    return clear(schema, tag);
  }

  return find(schema, tag, {
    ...options,
    'filter[id]': _.join(_.map(collection, 'id'), ','),
  });
}
