import { combineReducers } from 'redux';
import { resource } from '@shoutem/redux-io';

import { SHOPIFY_COLLECTIONS_SCHEMA } from './actions';

export default combineReducers({
  collections: resource(SHOPIFY_COLLECTIONS_SCHEMA),
});
