import { AsyncStorage } from 'react-native';
import _ from 'lodash';

import { loadFavoritesSchemas, saveFavorite } from './redux';

const SETTINGS_ATTRIBUTE = 'favoritesSchemas';

/**
 * Parses extension shortcuts from application configuration in state
 * for shortcuts that have favoritesSchemas attribute set.
 *
 * @param state Global redux state.
 * @returns {{}} Favorites schemas.
 */
function extractFavoritesSchemas(state) {
  const favoritesSchemaProp = `attributes.settings.${SETTINGS_ATTRIBUTE}`;
  const shortcuts = _.filter(state['shoutem.application'].shortcuts, favoritesSchemaProp);
  const schemas = _.uniq(_.flatMap(shortcuts, favoritesSchemaProp));

  return _.reduce(schemas, (result, schema) => _.set(result, [schema], true), {});
}

/**
 * Fetches all favorite items for each given schema
 * from local storage and saves them in state.
 *
 * @param schemas Extracted favorites schemas.
 * @param dispatch Dispatch for action creators.
 */
function getFavorites(schemas, dispatch) {
  _.forEach(schemas, (value, schema) => {
    AsyncStorage.getItem(schema, (err, results) => {
      if (results) {
        _.forEach(JSON.parse(results), (item) => {
          dispatch(saveFavorite(item, schema));
        });
      }
    });
  });
}

export function saveStateToLocalStorage(schema, items) {
  AsyncStorage.setItem(schema, JSON.stringify(items));
}

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const schemas = extractFavoritesSchemas(state);

  if (!_.isEmpty(schemas)) {
    store.dispatch(loadFavoritesSchemas(schemas));
  }

  getFavorites(schemas, store.dispatch);
}
