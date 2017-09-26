import { combineReducers } from 'redux';
import _ from 'lodash';

import { saveStateToLocalStorage } from './app';

const LOAD_FAVORITES_SCHEMAS = 'shoutem.favorites.LOAD_FAVORITES_SCHEMAS';
const SAVE_FAVORITE_ITEM = 'shoutem.favorites.SAVE_FAVORITE_ITEM';
const DELETE_FAVORITE_ITEM = 'shoutem.favorites.DELETE_FAVORITE_ITEM';

/**
 * Action creator used to save favorite items
 * for a specific scheme.
 *
 * @param data {Object} Data containing favorite items.
 * @param schema {string} Schema name of favorite items.
 * @returns {{type: string, data: {}, schema: string}} Action.
 */
export function saveFavorite(data, schema) {
  return {
    type: SAVE_FAVORITE_ITEM,
    data,
    schema,
  };
}

/**
 * Action creator used to delete a favorite item
 * for a specific scheme.
 *
 * @param id {string} containing favorite items.
 * @param schema {string} Schema name of favorite items.
 * @returns {{type: string, id: string, schema: string}} Action.
 */
export function deleteFavorite(id, schema) {
  return {
    type: DELETE_FAVORITE_ITEM,
    id,
    schema,
  };
}

/**
 * Action creator used to load favorites schemas in state.
 *
 * @param favoritesSchemas {array} Map containing favorites schemas.
 * @returns {{type: string, favoritesSchemas: {}}} Action.
 */
export function loadFavoritesSchemas(favoritesSchemas) {
  return {
    type: LOAD_FAVORITES_SCHEMAS,
    favoritesSchemas,
  };
}

/**
 * A reducer that, for a specific scheme, adds new item or removes it
 * if it is already favorite (toggle). Saves state to storage and
 * returns all favorite items.
 *
 * @param state {Object} Current global redux state.
 * @param action {Object} Object containing schema name for which
 * items are saved and data array containing favorite item.
 * @returns {{}} New state with refreshed favorite items.
 */
function favoriteItems(state = {}, action) {
  let newCollection;
  const newState = { ...state };

  switch (action.type) {
    case SAVE_FAVORITE_ITEM:
      if (!state[action.schema]) {
        newState[action.schema] = {};
      }
      newCollection = _.uniqBy([...newState[action.schema], action.data], 'id');
      newState[action.schema] = newCollection;
      saveStateToLocalStorage(action.schema, newCollection);
      return newState;
    case DELETE_FAVORITE_ITEM:
      newCollection = _.reject(newState[action.schema], ['id', action.id]);
      newState[action.schema] = newCollection;

      saveStateToLocalStorage(action.schema, newCollection);
      return newState;
    default:
      return state;
  }
}


/**
 * A reducer that returns all favorites schemas.
 * @param state {Object} Current global redux state.
 * @param action {Object} Object containing favorites schemas.
 * @returns {{}} New state containing favorites schemas.
 *
 */
function schemas(state = {}, action) {
  switch (action.type) {
    case LOAD_FAVORITES_SCHEMAS:
      return { ...action.favoritesSchemas };
    default:
      return state;
  }
}


export default combineReducers({
  schemas,
  favoriteItems,
});
