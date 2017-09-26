import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { EXTENSION_INSTALLATIONS } from 'types';

const storageReducer = combineReducers({
  [EXTENSION_INSTALLATIONS]: storage(EXTENSION_INSTALLATIONS),
});

export default combineReducers({
  storage: storageReducer,
});
