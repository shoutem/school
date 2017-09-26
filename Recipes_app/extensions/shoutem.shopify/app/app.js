import { getExtensionSettings } from 'shoutem.application';
import Shopify from 'react-native-shopify';
import _ from 'lodash';

import { ext } from './const';

import {
  refreshProducts,
  shopLoading,
  shopLoaded,
  shopErrorLoading,
  appMounted,
} from './redux/actionCreators';

/*
 * Loads all collections from Shopify recursively since each query is
 * limited to 25 collections by their SDK
 */
const getAllCollections = (page = 1, allCollections = []) =>
  Shopify.getCollections(page).then((collections) => {
    if (_.size(collections)) {
      return getAllCollections(page + 1, [...allCollections, ...collections]);
    }
    return allCollections;
  });

/*
 * Loads all tags from Shopify recursively since each query is
 * limited to 25 tags by their SDK
 */
const getAllTags = (page = 1, allTags = []) =>
  Shopify.getProductTags(page).then((tags) => {
    if (_.size(tags)) {
      return getAllTags(page + 1, [...allTags, ...tags]);
    }
    return allTags;
  });

/* eslint-disable consistent-return */
export function appDidMount(app) {
  const store = app.getStore();
  const { dispatch } = store;
  const state = store.getState();

  const { store: shopifyStore, apiKey } = getExtensionSettings(state, ext());

  if (!(shopifyStore && apiKey)) {
    return dispatch(shopErrorLoading());
  }

  dispatch(appMounted());

  Shopify.initialize(shopifyStore, apiKey);

  dispatch(shopLoading());

  Promise.all([getAllCollections(), Shopify.getShop(), getAllTags()])
  .then(([collections, shop, tags]) => {
    dispatch(shopLoaded(collections, shop, tags));
    dispatch(refreshProducts());
  })
  .catch(() => {
    dispatch(shopErrorLoading());
  });
}
