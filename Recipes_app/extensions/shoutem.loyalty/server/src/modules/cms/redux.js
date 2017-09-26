import _ from 'lodash';
import { combineReducers } from 'redux';
import { find, storage, remove } from '@shoutem/redux-io';
import { RSAA } from 'redux-api-middleware';
import { setShortcutScope, setExtensionScope } from '@shoutem/redux-api-sdk';
import ext from '../../const';
import { rsaaPromise, getCmsUrl } from './services';

// CONST
export const moduleName = 'cms';
export const CATEGORIES = 'shoutem.core.categories';
export const SCHEMAS = 'shoutem.core.schemas';

// ACTIONS
export function loadResources(
  appId,
  categoryId,
  schema,
  filter = {},
  tag = ext('resources'),
  scope = {},
) {
  const categoryQuery = categoryId ? {
    'filter[categories]': categoryId,
  } : {};

  const params = {
    q: {
      ...categoryQuery,
      ...filter,
    },
    ...scope,
  };

  const config = {
    schema,
    request: {
      endpoint: getCmsUrl(`/v1/apps/${appId}/resources/${schema}{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, tag, params);
}

export function deleteResource(appId, resourceId, schema, scope = {}) {
  const config = {
    schema,
    request: {
      endpoint: getCmsUrl(`/v1/apps/${appId}/resources/${schema}/${resourceId}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  const resource = { type: schema, id: resourceId };
  return remove(config, resource, scope);
}

// TODO this should be on new API - not supported yet
export function createCategory(appId, schema, categoryName, scope = {}) {
  return dispatch => {
    const query = {
      nid: appId,
      version: 58,
    };

    const endpoint = getCmsUrl('api/modules/0/groups/create', query, true);
    const createCategoryAction = {
      [RSAA]: {
        endpoint,
        method: 'POST',
        body: JSON.stringify({
          name: categoryName,
          schema,
        }),
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        types: [
          '@@cms/CREATE_CATEGORY_REQUEST',
          '@@cms/CREATE_CATEGORY_SUCCESS',
          '@@cms/CREATE_CATEGORY_ERROR',
        ],
      },
    };

    const extensionName = _.get(scope, 'extensionName');
    if (extensionName) {
      setExtensionScope(createCategoryAction, extensionName);
    }

    const shortcutId = _.get(scope, 'shortcutId');
    if (shortcutId) {
      setShortcutScope(createCategoryAction, shortcutId);
    }

    return (
      dispatch(rsaaPromise(createCategoryAction))
        .then(response => _.get(response, 'payload.id'))
    );
  };
}

export function navigateToCms(appId, categoryId, schema) {
  const options = {
    appId,
    categoryId,
    schema,
    source: ext(),
    isModal: true,
  };

  return {
    type: '@@navigator/NAVIGATE_REQUEST',
    payload: { component: 'CMS', options },
  };
}

// REDUCER
export const reducer = combineReducers({
  [SCHEMAS]: storage(SCHEMAS),
  [CATEGORIES]: storage(CATEGORIES),
});
