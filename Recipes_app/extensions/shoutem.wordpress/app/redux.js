import _ from 'lodash';
import URI from 'urijs';

import { combineReducers } from 'redux';
import { mapReducers } from '@shoutem/redux-composers';
import {
  find,
  resource,
  cloneStatus,
  LOAD_SUCCESS,
  STATUS,
} from '@shoutem/redux-io';
import Outdated from '@shoutem/redux-io/outdated';
import {
  APPEND_MODE,
} from '@shoutem/redux-io/actions/find';
import {
  validationStatus,
  busyStatus,
  createStatus,
  updateStatus,
  setStatus,
} from '@shoutem/redux-io/status';

import {
  getActionCurrentPage,
  getResponseTotalPages,
} from './services/pagination';
import { ext } from './const';

export const WORDPRESS_NEWS_SCHEMA = 'shoutem.wordpress.news';
export const WORDPRESS_MEDIA_SCHEMA = 'shoutem.wordpress.media';

export function resolveFeedUrl(feedUrl) {
  return `${feedUrl}/wp-json/wp/v2/posts?page={page}&per_page={perPage}`;
}

export function resolvePostsMediaUrl(feedUrl) {
  return `${feedUrl}/wp-json/wp/v2/media?include={include}`;
}

// ACTION CREATORS

/**
 * Action creator for fetching posts from WordPress v2 API
 * @param {Object} options
 * @param {string} options.feedUrl url to WordPress blog
 * @param {number} options.page page index
 * @param {number} options.perPage number of items in response
 * @param {bool} options.appendMode should returned items be appended to existing state
 */
export function fetchPosts({ feedUrl, page, perPage, appendMode = false }) {
  const config = {
    schema: WORDPRESS_NEWS_SCHEMA,
    request: {
      endpoint: resolveFeedUrl(feedUrl),
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };

  return find(config, undefined, { page, perPage }, { feedUrl, appendMode });
}

/**
 * Action creator for fetching media from WordPress v2 API
 * @param {Object} options
 * @param {string} options.feedUrl url to WordPress blog
 * @param {Array} options.posts array of posts for related media
 * @param {bool} options.appendMode should returned items be appended to existing state
 */
export function fetchPostsMedia({ feedUrl, posts, appendMode = false }) {
  const config = {
    schema: WORDPRESS_MEDIA_SCHEMA,
    request: {
      endpoint: resolvePostsMediaUrl(feedUrl),
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };
  const params = {
    include: _.map(posts, 'featured_media').join(','),
  };

  return find(config, undefined, params, { feedUrl, appendMode });
}

/**
 * Redux thunk for fetching posts and media one after other
 * @param {Object} options @see fetchPosts
 */
export function fetchWordpressPosts(options) {
  return dispatch => (
    dispatch(fetchPosts(options)).then((action) => {
      const { payload: posts } = action;

      return dispatch(fetchPostsMedia({ ...options, posts }));
    })
  );
}

// REDUCERS

function createDefaultStatus(schema) {
  return updateStatus(
    createStatus(),
    {
      schema,
      type: 'resource',
      id: _.uniqueId(),
    }
  );
}

function createNewState(state) {
  return _.isArray(state) ? [...state] : { ...state };
}

function isActionSchemeValid(action, schema) {
  if (_.get(action, 'meta.schema') !== schema) {
    return false;
  }

  return true;
}

function getNextActionEndpoint(action) {
  const endpointUri = new URI(_.get(action, 'meta.endpoint'));
  const currentPage = getActionCurrentPage(action);
  const totalPages = getResponseTotalPages(_.get(action, 'meta.response'));
  const nextPage = currentPage + 1;

  if (nextPage <= totalPages) {
    endpointUri.setQuery({ page: nextPage });

    return endpointUri.toString();
  }
  return null;
}

function getActionLinks(action) {
  return {
    next: getNextActionEndpoint(action),
  };
}

function getPostsActionLinks(action) {
  if (isActionSchemeValid(action, WORDPRESS_NEWS_SCHEMA)) {
    return getActionLinks(action);
  }

  return {};
}

function readFeedUrlFromAction(action) {
  return _.get(action, ['meta', 'options', 'feedUrl']);
}

/**
 * Reducer for handling WordPress v2 api JSON responses. It acts like resource reducer, but
 * it could append response data to one in the state if action has appendMode set in options
 * @param {string} schema Schema for which reducer is registered
 * @param {Object} initialState
 */
export function wordpressResource(schema, initialState = {}) {
  // eslint-disable-next-line no-param-reassign
  setStatus(initialState, createDefaultStatus(schema));
  const outdated = new Outdated();

  // Create default resource reducer instance
  const defaultResourceReducer = resource(schema, initialState);

  return (state = initialState, action) => {
    if (!isActionSchemeValid(action, schema)) {
      return state;
    }
    if (outdated.isOutdated(action)) {
      return state;
    }
    outdated.reportChange(action);
    const payload = action.payload;

    switch (action.type) {
      case LOAD_SUCCESS: {
        if (!_.isObject(payload)) {
          return state;
        }

        let newState = createNewState(payload);
        const isAppendMode = _.get(action, ['meta', 'options', APPEND_MODE]);
        const links = getPostsActionLinks(action);

        if (_.isArray(payload) && isAppendMode) {
          newState = _.concat(state, newState);
        }

        setStatus(newState, updateStatus(
          state[STATUS],
          {
            validationStatus: validationStatus.VALID,
            busyStatus: busyStatus.IDLE,
            error: false,
            links,
            schema,
          }
        ));
        return newState;
      }
      default:
        return defaultResourceReducer(state, action);
    }
  };
}

export default combineReducers({
    posts: mapReducers(readFeedUrlFromAction, wordpressResource(WORDPRESS_NEWS_SCHEMA)),
    media: mapReducers(readFeedUrlFromAction, wordpressResource(WORDPRESS_MEDIA_SCHEMA)),
});

// SELECTORS

/**
 * Redux state selector which selects featured media for provided item and returns item with
 * prepoplated featured media item
 * @param {Object} item one WordPress feed item
 * @param {Object} state redux app state
 * @param {string} feedUrl WordPress feed url
 */
export function getFeedItemInfo(item, state, feedUrl) {
  const mediaList = _.get(state, [ext(), 'media', feedUrl]);
  const itemInfo = { ...item };
  if (itemInfo.featured_media) {
    itemInfo.featured_media_object = _.find(mediaList, ['id', itemInfo.featured_media]);
  }

  return itemInfo;
}

/**
 * Redux state selector for getting feed items with prepopulated featured media items
 * @param {Object} state
 * @param {*} feedUrl
 */
export function getFeedItems(state, feedUrl) {
  const feedItems = _.get(state, [ext(), 'posts', feedUrl]);
  if (!feedItems) {
    return [];
  }
  const feedItemsInfo = _.map(feedItems, item => getFeedItemInfo(item, state, feedUrl));
  cloneStatus(feedItems, feedItemsInfo);

  return feedItemsInfo;
}