import { combineReducers } from 'redux';
import { storage, getCollection } from '@shoutem/redux-io';
import { rssFeed } from 'shoutem.rss';
import { ext } from '../const';

export const RSS_PHOTOS_SCHEMA = 'shoutem.proxy.photos';

export default combineReducers({
  photos: storage(RSS_PHOTOS_SCHEMA),
  allPhotos: rssFeed(RSS_PHOTOS_SCHEMA),
});

export function getPhotosFeed(state, feedUrl) {
  return getCollection(state[ext()].allPhotos[feedUrl], state);
}
