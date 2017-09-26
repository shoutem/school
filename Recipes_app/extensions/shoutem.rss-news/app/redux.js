import { combineReducers } from 'redux';
import { storage, getCollection } from '@shoutem/redux-io';

import { rssFeed } from 'shoutem.rss';

import { ext } from './const';

export const RSS_NEWS_SCHEMA = 'shoutem.proxy.news';

export default combineReducers({
  news: storage(RSS_NEWS_SCHEMA),
  latestNews: rssFeed(RSS_NEWS_SCHEMA),
});

export function getNewsFeed(state, feedUrl) {
  return getCollection(state[ext()].latestNews[feedUrl], state);
}
