import { createScopedReducer, getShortcutState } from '@shoutem/redux-api-sdk';
import { resource, find, cloneStatus, RESOLVED_ENDPOINT } from '@shoutem/redux-io';
import _ from 'lodash';
import {
  resolveVideosFetchEndpoint,
  resolveVideosSearchEndpoint,
  isUserUrl,
  isChannelUrl,
  isPlaylistUrl,
  resolveUserChannel,
  createYoutubeValidationUrl,
  createYoutubePlaylistUrl,
} from './services/youtube';

export const YOUTUBE_API_SETTINGS = 'shoutem.youtube.api-settings';
export const FEED_ITEMS = 'shoutem.youtube.feedItems';
const SEARCH_RESULTS = 'shoutem.youtube.search-results';
const USER = 'shoutem.youtube.user';

export default createScopedReducer({
  shortcut: {
    feedItems: resource(FEED_ITEMS),
  },
});

const resolvedEndpointOptions = {
  [RESOLVED_ENDPOINT]: true,
};

export function validateYoutubeSettings(apiKey) {
  const config = {
    schema: YOUTUBE_API_SETTINGS,
    request: {
      endpoint: createYoutubeValidationUrl(apiKey),
      resourceType: 'json',
      headers: {},
    },
  };
  return find(config, 'validation');
}

function searchVideos(feedUrl, apiKey, shortcutId) {
  const endpoint = resolveVideosSearchEndpoint(feedUrl, apiKey);
  if (!endpoint) {
    return null;
  }
  const config = {
    schema: SEARCH_RESULTS,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
  return find(config, 'searchVideos', { shortcutId }, resolvedEndpointOptions);
}

function fetchVideos(feedUrl, apiKey, videoIds, shortcutId) {
  const endpoint = resolveVideosFetchEndpoint(feedUrl, apiKey, videoIds);
  if (!endpoint) {
    return null;
  }
  const config = {
    schema: FEED_ITEMS,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
  return find(config, 'feedItems', { shortcutId }, resolvedEndpointOptions);
}

function fetchUserChannel(feedUrl, apiKey, shortcutId) {
  const endpoint = resolveUserChannel(feedUrl, apiKey);
  if (!endpoint) {
    return null;
  }
  const config = {
    schema: USER,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };
  return find(config, 'userChannel', { shortcutId }, resolvedEndpointOptions);
}

function fetchChannelVideos(feedUrl, apiKey, shortcutId) {
  return (dispatch) => (
    dispatch(searchVideos(feedUrl, apiKey, shortcutId)).then((action) => {
      const items = _.get(action, 'payload.items');
      const videoIds = _.map(items, item => (_.get(item, 'id.videoId')));
      return dispatch(fetchVideos(feedUrl, apiKey, videoIds, shortcutId));
    })
  );
}

function fetchPlaylistVideos(feedUrl, apiKey, shortcutId) {
  return (dispatch) => (
    dispatch(searchVideos(feedUrl, apiKey, shortcutId)).then((action) => {
      const items = _.get(action, 'payload.items');
      const videoIds = _.map(items, item => (_.get(item, 'snippet.resourceId.videoId')));
      return dispatch(fetchVideos(feedUrl, apiKey, videoIds, shortcutId));
    })
  );
}

function fetchUserVideos(feedUrl, apiKey, shortcutId) {
  return (dispatch) => (
    dispatch(fetchUserChannel(feedUrl, apiKey, shortcutId)).then((action) => {
      const items = _.get(action, 'payload.items', []);
      const playlistId = _.get(items, '0.contentDetails.relatedPlaylists.uploads');

      if (_.isEmpty(playlistId)) {
        throw new Error('Cannot extract content from user channel');
      }
      const playlistUrl = createYoutubePlaylistUrl(playlistId);
      return dispatch(fetchPlaylistVideos(playlistUrl, apiKey, shortcutId));
    })
  );
}


export function loadFeed(feedUrl, apiKey, shortcutId) {
  return (dispatch) => {
    if (isUserUrl(feedUrl)) {
      return dispatch(fetchUserVideos(feedUrl, apiKey, shortcutId));
    }
    if (isChannelUrl(feedUrl)) {
      return dispatch(fetchChannelVideos(feedUrl, apiKey, shortcutId));
    }
    if (isPlaylistUrl(feedUrl)) {
      return dispatch(fetchPlaylistVideos(feedUrl, apiKey, shortcutId));
    }
    throw Error('Invalid Url');
  };
}

function createFeedItemInfo(item) {
  const feedItem = _.get(item, 'snippet');
  const feedItemDuration = _.get(item, 'contentDetails');
  const feedItemInfo = {
    id: item.id,
    ...feedItem,
    ...feedItemDuration,
  };

  cloneStatus(feedItem, feedItemDuration, feedItemInfo);
  return feedItemInfo;
}

export function getFeedItems(state, extensionName, shortcutId) {
  const shortcutState = getShortcutState(state, extensionName, shortcutId);
  const feedItems = _.get(shortcutState, 'feedItems');

  if (!feedItems) {
    return [];
  }

  const feedItemInfos = _.map(_.get(feedItems, 'items'), item => createFeedItemInfo(item));
  cloneStatus(feedItems, feedItemInfos);
  return feedItemInfos;
}
