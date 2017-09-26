import { storage, collection } from '@shoutem/redux-io';
import { combineReducers } from 'redux';

import { cmsCollection } from 'shoutem.cms';
import { ext } from './const';


export default combineReducers({
  books: storage(ext('Books')),
  allBooks: cmsCollection(ext('Books')),
  favoriteBooks: collection(ext('Books'), 'favorite'),
});
