import { combineReducers } from 'redux';
import layoutPageReducer, { SHORTCUTS, SCREENS, HIERARCHY } from './layoutPage/reducer';
import { storage } from '@shoutem/redux-io';

const storageReducer = combineReducers({
  [SHORTCUTS]: storage(SHORTCUTS),
  [SCREENS]: storage(SCREENS),
  [HIERARCHY]: storage(HIERARCHY),
});

export default combineReducers({
  layoutPage: layoutPageReducer,
  storage: storageReducer,
});
