import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';

import { cmsCollection } from 'shoutem.cms';
import { ext } from './const';

export default combineReducers({
  news: storage(ext('articles')),
  latestNews: cmsCollection(ext('articles')),
});
