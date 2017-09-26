import { storage } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import { cmsCollection } from 'shoutem.cms';

import { ext } from '../const';

export default combineReducers({
  products: storage(ext('Products')),
  latestProducts: cmsCollection(ext('Products')),
});
