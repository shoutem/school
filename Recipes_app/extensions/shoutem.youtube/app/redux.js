import { combineReducers } from 'redux';
import URI from 'urijs';
import _ from 'lodash';

import {
  find,
  resource,
  LOAD_SUCCESS,
  STATUS,
} from '@shoutem/redux-io';
import Outdated from '@shoutem/redux-io/outdated';
import {
  APPEND_MODE,
  isAppendMode,
} from '@shoutem/redux-io/actions/find';
import {
  validationStatus,
  busyStatus,
  updateStatus,
  setStatus,
} from '@shoutem/redux-io/status';
import {
  createInitialStatus,
  canHandleAction,
} from '@shoutem/redux-io/reducers/resource';
import { mapReducers } from '@shoutem/redux-composers';

import { resolveUserPlaylistUrl } from './services/user-uploads';
import {
  ext,
  CHANNEL_REGEX,
  PLAYLIST_REGEX,
  API_ENDPOINT,
} from './const';

export const YOUTUBE_PLAYLIST_SCHEMA = 'shoutem.youtube.playlist';
export const YOUTUBE_VIDEOS_SCHEMA = 'shoutem.youtube.videos';

/**
 * Check if there is another page of youtube videos
 * @param {Object} payload Current action payload that contain list of Youtube videos
 * @return {Boolean}
 */
function hasNextPage(payload) {
  return !!_.get(payload, 'nextPageToken');
}

function getNextActionParams(action) {
  return {
    ..._.get(action, 'meta.params'),
    pageToken: _.get(action, 'payload.nextPageToken'),
  };
}

function getNextActionEndpoint(action) {
  const params = getNextActionParams(action);
  const unusedParams = _.omit(params, ['type']);
  const endpointUri = new URI(API_ENDPOINT.replace(/{type}/g, params.type));
  const resolvedParams = { ...endpointUri.query(true), ...unusedParams };

  return endpointUri.query(resolvedParams).toString();
}

/**
 * Get next action links object
 * @param {Object} action Current dispatched action object
 * @return {Object}
 */
function getNextActionLinks(action) {
  return {
    next: getNextActionEndpoint(action),
  };
}

function getFeedUrlFromAction(action) {
  return _.get(action, ['meta', 'params', 'feedUrl']);
}

export function youtubeResource(schema, initialState = []) {
  // eslint-disable-next-line no-param-reassign
  setStatus(initialState, createInitialStatus(schema));
  const outdated = new Outdated();

  // Create default resource reducer instance
  const defaultResourceReducer = resource(schema, initialState);

  return (state = initialState, action) => {
    if (!canHandleAction(action, schema)) {
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

        const newItems = _.get(payload, 'items', []);
        const newState = isAppendMode(action)
          ? [...state, ...newItems]
          : [...newItems];
        const links = hasNextPage(payload) ? getNextActionLinks(action) : {};
        const params = hasNextPage(payload) ? getNextActionParams(action) : {};

        setStatus(newState, updateStatus(
          state[STATUS],
          {
            validationStatus: validationStatus.VALID,
            busyStatus: busyStatus.IDLE,
            error: false,
            links,
            params,
            schema,
          },
        ));
        return newState;
      }
      default:
        return defaultResourceReducer(state, action);
    }
  };
}

export default combineReducers({
  videos: mapReducers(getFeedUrlFromAction, youtubeResource(YOUTUBE_VIDEOS_SCHEMA)),
});

export function getVideosFeed(state, feedUrl) {
  return _.get(state[ext()], ['videos', feedUrl], []);
}

const sharedParams = {
  part: 'snippet',
  maxResults: 20,
};

/**
 * This regex will extract the parameter id from a YouTube channel link, for example,
 * for the link https://www.youtube.com/channel/UCrJs_gMaJZDqN6Wz76FQ35A,
 * regex will result with UCrJs_gMaJZDqN6Wz76FQ35A.
 */
function extractChannelId(feedUrl) {
  // eslint-disable-next-line max-len
  return _.get(feedUrl.match(CHANNEL_REGEX), 1);
}

/**
 * This regex will extract the parameter id from a YouTube playlist link, for example,
 * for the link https://www.youtube.com/watch?v=2jAoKF2heDE&list=PLjVnDc2oPyOGBOb75V8CpeSr9Gww8pZdL,
 * regex will result with UCrJs_gMaJZDqN6Wz76FQ35A.
 */
function extractPlaylistId(feedUrl) {
  return _.get(feedUrl.match(PLAYLIST_REGEX), 1);
}

function fetchUserPlaylistId(feedUrl, apiKey) {
  const endpoint = resolveUserPlaylistUrl(feedUrl, apiKey);
  if (!endpoint) {
    return null;
  }
  const config = {
    schema: YOUTUBE_PLAYLIST_SCHEMA,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
  return find(config);
}

function fetchUserUploads(feedUrl, apiKey, playlistIds) {
  const params = {
    type: 'playlistItems',
    playlistId: playlistIds,
    key: apiKey,
    feedUrl,
  };
  return find(YOUTUBE_VIDEOS_SCHEMA, undefined, { ...params, ...sharedParams });
}

function buildFeedParams(feedUrl, apiKey) {
  if (/channel/i.test(feedUrl)) {
    return {
      type: 'search',
      channelId: extractChannelId(feedUrl),
      key: apiKey,
    };
  } else if (/playlist/i.test(feedUrl)) {
    return {
      type: 'playlistItems',
      playlistId: extractPlaylistId(feedUrl),
      key: apiKey,
    };
  }
  return {};
}

function userFeedThunk(feedUrl, apiKey) {
  let params;
  return (dispatch) => {
    dispatch(fetchUserPlaylistId(feedUrl, apiKey)).then((action) => {
      const { payload } = action;
      const playlistIds = _.map(payload.items, items =>
          (_.get(items, 'contentDetails.relatedPlaylists.uploads')),
        );
      dispatch(fetchUserUploads(feedUrl, apiKey, playlistIds));
    });
    return find(YOUTUBE_VIDEOS_SCHEMA, undefined, { ...params, ...sharedParams });
  };
}

export function fetchFeed(feedUrl, apiKey) {
  if (/user/i.test(feedUrl)) {
    return userFeedThunk(feedUrl, apiKey);
  }

  const params = buildFeedParams(feedUrl, apiKey);
  return find(YOUTUBE_VIDEOS_SCHEMA, undefined, { ...params, ...sharedParams });
}
