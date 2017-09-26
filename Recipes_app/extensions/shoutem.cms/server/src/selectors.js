import _ from 'lodash';
import { ext } from 'context';
import { denormalizeCollection, denormalizeItem } from 'denormalizer';
import { CATEGORIES, SCHEMAS, CURRENT_SCHEMA } from './types';
import { isInitialized } from '@shoutem/redux-io';
import { createSelector } from 'reselect';

export function getCmsState(state) {
  return state[ext()].cmsPage;
}

export function getCategories(state, tag = 'all') {
  const cmsState = getCmsState(state);
  const categories = _.get(cmsState, ['categories', tag]);
  return denormalizeCollection(categories, undefined, CATEGORIES);
}

export function getSchema(state) {
  const cmsState = getCmsState(state);
  return denormalizeItem(cmsState.schema, undefined, SCHEMAS);
}

export function getResources(state) {
  const cmsState = getCmsState(state);
  return denormalizeCollection(cmsState.resources, undefined, CURRENT_SCHEMA);
}

export const dataInitialized = (shortcut) => createSelector(
  getCategories,
  getSchema,
  getResources,
  (categories, schema, resources) => {
    const shortcutSettings = shortcut.settings || {};
    const { parentCategory } = shortcutSettings;

    const resourcesInitialized = !parentCategory || isInitialized(resources);
    return resourcesInitialized && isInitialized(categories) && isInitialized(schema);
  }
);
