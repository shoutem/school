import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';

import { cmsCollection } from 'shoutem.cms';
import { ext } from './const';

export const VIDEOS_SCHEMA = ext('Videos');

export default combineReducers({
  videos: storage(VIDEOS_SCHEMA),
  latestVideos: cmsCollection(VIDEOS_SCHEMA),
});
