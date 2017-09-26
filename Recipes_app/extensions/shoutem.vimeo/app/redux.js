import { combineReducers } from 'redux';
import { storage, getCollection } from '@shoutem/redux-io';

import { rssFeed } from 'shoutem.rss';

import { ext } from './extension';

export const VIMEO_SCHEMA = 'shoutem.proxy.videos';

export default combineReducers({
  videos: storage(VIMEO_SCHEMA),
  allVideos: rssFeed(VIMEO_SCHEMA),
});

export function getVimeoFeed(state, feedUrl) {
  return getCollection(state[ext()].allVideos[feedUrl], state);
}
