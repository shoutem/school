import { combineReducers } from 'redux';
import { storage, getCollection } from '@shoutem/redux-io';

import { rssFeed } from 'shoutem.rss';

import { ext } from './const';

export const RSS_VIDEOS_SCHEMA = 'shoutem.proxy.videos';

export default combineReducers({
  videos: storage(RSS_VIDEOS_SCHEMA),
  allVideos: rssFeed(RSS_VIDEOS_SCHEMA),
});

export function getVideosFeed(state, feedUrl) {
  return getCollection(state[ext()].allVideos[feedUrl], state);
}

