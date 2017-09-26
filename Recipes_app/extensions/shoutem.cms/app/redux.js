import _ from 'lodash';
import { combineReducers } from 'redux';

import { mapReducers } from '@shoutem/redux-composers';
import { storage, collection, getCollection } from '@shoutem/redux-io';

import { ext } from './const';
import permissionStatus from './reducers';

export const CATEGORIES_SCHEMA = 'shoutem.core.categories';
export const IMAGE_ATTACHMENTS_SCHEMA = 'shoutem.core.image-attachments';
export const VIDEO_ATTACHMENTS_SCHEMA = 'shoutem.core.video-attachments';

// 2 hours
const EXPIRATION_TIME_CATEGORIES = 2 * 60 * 60;

// 15 minutes
const EXPIRATION_TIME_RESOURCES = 15 * 60;

function getCategoryIds(action) {
  return _.get(action, ['meta', 'params', 'filter[categories]']);
}

function getParentCategoryId(action) {
  return _.get(action, ['meta', 'params', 'filter[parent]']);
}

/**
 * Map reducer use this creator to create new collection reducer for every key.
 * This is important to get different collection ids for every collection.
 * @param schema
 * @param settings
 * @returns {function} - reducer creator
 */
function createCollectionCreator(schema, settings) {
  return () => collection(schema, undefined, settings);
}

/**
 * A reducer that stores CMS resources grouped by categories.
 *
 * @param schema The schema name of CMS resources.
 * @param settings Collection settings.
 * @returns {*} A reducer that will create a map where
 *   keys represent category IDs, and values resources
 *   in those categories.
 */
export function cmsCollection(schema, settings = { expirationTime: EXPIRATION_TIME_RESOURCES }) {
  return mapReducers(getCategoryIds, createCollectionCreator(schema, settings));
}

/**
 * A reducer that stores CMS categories grouped by parent
 * categories.
 *
 * @returns {*} A reducer that will create a map where
 *   keys represent parent category IDs, and values child
 *   categories of those categories.
 */
export function childCategories() {
  return mapReducers(
    getParentCategoryId,
    createCollectionCreator(CATEGORIES_SCHEMA, { expirationTime: EXPIRATION_TIME_CATEGORIES }),
  );
}

/**
 * A selector that returns all child categories of a given
 * parent category from the redux state.
 *
 * @param state The global redux state.
 * @param parentId The parent category ID.
 * @returns {[]} The child categories.
 */
export function getCategories(state, parentId) {
  return getCollection(state[ext()].childCategories[parentId], state);
}

export function getLocationPermissionStatus(state) {
  return state[ext()].permissionStatus;
}

export default combineReducers({
  categories: storage(CATEGORIES_SCHEMA),
  images: storage(IMAGE_ATTACHMENTS_SCHEMA),
  videos: storage(VIDEO_ATTACHMENTS_SCHEMA),

  childCategories: childCategories(),
  permissionStatus,
});
