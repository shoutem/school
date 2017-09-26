import { storage } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import { cmsCollection } from 'shoutem.cms';
import { ext } from '../const';

export default combineReducers({
  photos: storage(ext('Photos')),
  allPhotos: cmsCollection(ext('Photos')),
});
