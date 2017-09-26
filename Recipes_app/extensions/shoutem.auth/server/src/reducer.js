import { combineReducers } from 'redux';
import { params } from 'context';
import settingsPageReducer from './settingsPage/reducer';
import providersPageReducer from './providersPage/reducer';
import { storage } from '@shoutem/redux-io';
import { EXTENSION_INSTALLATIONS, SHORTCUTS, LEGACY_APPLICATION_SETTINGS } from 'types';

const storageReducer = combineReducers({
  [EXTENSION_INSTALLATIONS]: storage(EXTENSION_INSTALLATIONS),
  [SHORTCUTS]: storage(SHORTCUTS),
  [LEGACY_APPLICATION_SETTINGS]: storage(LEGACY_APPLICATION_SETTINGS)
});

export default combineReducers({
  settingsPage: settingsPageReducer,
  providersPage: providersPageReducer,
  storage: storageReducer,
});
