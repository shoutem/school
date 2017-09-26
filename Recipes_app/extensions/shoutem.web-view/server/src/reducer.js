import { combineReducers } from 'redux';
import webPageReducer, { SHORTCUTS } from './webPage/reducer';
import { storage } from '@shoutem/redux-io';

const storageReducer = combineReducers({
  [SHORTCUTS]: storage(SHORTCUTS),
});

export default combineReducers({
  webPage: webPageReducer,
  storage: storageReducer,
});
