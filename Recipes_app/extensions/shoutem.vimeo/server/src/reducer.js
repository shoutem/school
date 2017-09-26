import { combineReducers } from 'redux';
import VimeoPageReducer, { DISCOVERED_FEEDS, FEED_ITEMS } from './VimeoPage/reducer';
import { storage } from '@shoutem/redux-io';

const storageReducer = combineReducers({
  [DISCOVERED_FEEDS]: storage(DISCOVERED_FEEDS),
  [FEED_ITEMS]: storage(FEED_ITEMS),
});

export default combineReducers({
  VimeoPage: VimeoPageReducer,
  storage: storageReducer,
});
