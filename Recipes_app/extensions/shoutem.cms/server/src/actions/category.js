import _ from 'lodash';
import { url, appId, auth, navigateTo } from 'environment';
import Uri from 'urijs';
import { RSAA } from 'redux-api-middleware';
import { find } from '@shoutem/redux-io';
import { ext } from 'context';
import { CATEGORIES, CURRENT_SCHEMA } from '../types';
import { rsaaPromise } from '../services';
import { updateShortcutCategories } from './shortcut';

const CREATE_CATEGORY_REQUEST = '@@cms/CREATE_CATEGORY_REQUEST';
const CREATE_CATEGORY_SUCCESS = '@@cms/CREATE_CATEGORY_SUCCESS';
const CREATE_CATEGORY_ERROR = '@@cms/CREATE_CATEGORY_ERROR';

export function loadCategories(
  parentCategoryId,
  schema = CURRENT_SCHEMA,
  tag = 'all',
) {
  const queryParams = {
    'filter[schema]': schema,
    'page[limit]': 1000,
    'filter[parent]': parentCategoryId,
  };

  const config = {
    schema: CATEGORIES,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/categories`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext(tag), queryParams);
}

export function createCategory(shortcut, schema = CURRENT_SCHEMA) {
  return dispatch => {
    // use legacy api to create new category. New api is not working yet.
    // Response should be in json api format, so another request is made
    // to get category by id
    const endpoint = new Uri('api/modules/0/groups/create')
      .protocol(location.protocol)
      .host(url.legacy)
      .query({
        nid: appId,
        session_id: auth.session,
        version: 58,
      })
      .toString();

    const categoryName = shortcut.title;
    const createCategoryAction = {
      [RSAA]: {
        endpoint,
        method: 'POST',
        body: JSON.stringify({
          schema,
          name: categoryName,
        }),
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        types: [
          CREATE_CATEGORY_REQUEST,
          CREATE_CATEGORY_SUCCESS,
          CREATE_CATEGORY_ERROR,
        ],
      },
    };

    return (
      dispatch(rsaaPromise(createCategoryAction))
        .then(response => {
          const categoryId = _.toString(response.payload.id);
          return dispatch(updateShortcutCategories(shortcut, categoryId))
            .then(() => categoryId);
        })
    );
  };
}

export function navigateToCategoryContent(categoryId, schema = CURRENT_SCHEMA) {
  const options = {
    categoryId,
    appId,
    schema,
    source: ext(),
    isModal: true,
  };

  return navigateTo('CMS', options);
}
