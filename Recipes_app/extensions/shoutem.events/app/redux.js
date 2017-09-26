import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { cmsCollection } from 'shoutem.cms';

import {
  EVENTS_SCHEME,
  EVENTS_TAG,
} from './const';


export default combineReducers({
  events: storage(EVENTS_SCHEME),
  [EVENTS_TAG]: cmsCollection(EVENTS_SCHEME),
});
