import { find } from '@shoutem/redux-io';

export const SHOPIFY_COLLECTIONS_SCHEMA = 'shoutem.shopify.collections';

export function loadCollections(store, apiKey) {
  /* eslint-disable no-undef */
  const authorization = `Basic ${btoa(apiKey)}`;

  const config = {
    schema: SHOPIFY_COLLECTIONS_SCHEMA,
    request: {
      endpoint: `https://${store}/api/apps/8/collection_listings.json`,
      headers: {
        'Authorization': authorization,
      },
      resourceType: 'json',
    },
  };

  return find(config);
}

// We use the loadCollections action to validate the URL and key since we already defined it.
// Any action that calls Shopify would do.
export function validateShopifySettings(store, apiKey) {
  return loadCollections(store, apiKey);
}
