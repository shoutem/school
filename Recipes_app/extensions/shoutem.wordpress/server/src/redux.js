import { createScopedReducer, getShortcutState } from '@shoutem/redux-api-sdk';
import { resource, find, cloneStatus, RESOLVED_ENDPOINT } from '@shoutem/redux-io';
import _ from 'lodash';
import { toLocalDateTime } from './services/wordpress';
import ext from './const';

export const FEED_ITEMS = 'shoutem.wordpress.feedItems';
export const WORDPRESS_MEDIA_SCHEMA = 'shoutem.wordpress.media';

export default createScopedReducer({
  shortcut: {
    feedItems: resource(FEED_ITEMS),
    media: resource(WORDPRESS_MEDIA_SCHEMA),
  },
});

const resolvedEndpointOptions = {
  [RESOLVED_ENDPOINT]: true,
};

export function getPostsMediaParams(posts) {
  return {
    include: _.filter(_.map(posts, 'featured_media'), (mediaId) => !!mediaId),
  };
}

export function loadPosts({ feedUrl, shortcutId }) {
  const config = {
    schema: FEED_ITEMS,
    request: {
      endpoint: `${feedUrl}/wp-json/wp/v2/posts`,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };
  return find(config, ext('feedItems'), { shortcutId }, resolvedEndpointOptions);
}

function loadPostsMedia({ feedUrl, posts, per_page, appendMode = false }) {
  const config = {
    schema: WORDPRESS_MEDIA_SCHEMA,
    request: {
      endpoint: `${feedUrl}/wp-json/wp/v2/media`,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };

  return find(config, ext('feedItemsMedia'), {
    ...getPostsMediaParams(posts), per_page,
  }, { feedUrl, appendMode });
}

export function fetchWordpressPosts(params) {
  return dispatch => (
    dispatch(loadPosts(params)).then((action) => {
      const { payload: posts } = action;
      return dispatch(loadPostsMedia({ ...params, posts })).then(() => action);
    })
  );
}

function createFeedItemInfo(feedItem, shortcutState) {
  const mediaList = _.get(shortcutState, 'media');
  const dateTime = toLocalDateTime(feedItem.date);
  const { dateTimeDisplay, dateTimeFormatted } = dateTime;

  if (feedItem.featured_media) {
    // eslint-disable-next-line
    feedItem.featured_media_object = _.first(
      _.filter(mediaList, media => media.id === feedItem.featured_media)
    );
  }

  const feedItemInfo = {
    ...feedItem,
    dateTimeFormatted,
    dateTimeDisplay,
  };

  cloneStatus(feedItem, feedItemInfo);
  return feedItemInfo;
}

export function getFeedItems(state, extensionName, shortcutId) {
  const shortcutState = getShortcutState(state, extensionName, shortcutId);
  const feedItems = _.get(shortcutState, 'feedItems');

  if (!feedItems) {
    return [];
  }

  const feedItemInfos = _.map(feedItems, item => createFeedItemInfo(item, shortcutState));
  cloneStatus(feedItems, feedItemInfos);
  return feedItemInfos;
}
