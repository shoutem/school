import _ from 'lodash';
import { ext } from '../const';

export const getCartSize = (state) => {
  const { cart } = state[ext()];
  return _.reduce(cart, (result, item) => result + item.quantity, 0);
};

export const getCartTotal = (state, withShipping) => {
  const { cart, selectedShippingMethod: { price: shipping } } = state[ext()];

  const productsTotal = cart.reduce((total, { quantity, variant }) =>
    total + (quantity * variant.price), 0);

  const total = withShipping ? productsTotal + parseInt(shipping, 10) : productsTotal;
  return total.toFixed(2);
};

/**
 * Gets already fetched products for tag or collection, saved in local state.
 * Products are stored in two indexes, by tag and collection ID. The indexes
 * contain their loading and error status, page and IDs. This function
 * uses the IDs from an index to load products from a local dictionary.
 *
 * The 'All' collection is keyed by 0.
 *
 * @param tag - Tag used for filtering
 * @param collectionId - ID of the collection
 * @param state - Local state
 * @returns List of locally stored products and their status for tag or collection
 */
export const getProducts = (state, collectionId = 0, tag) => {
  const { products, collections, tags } = state[ext()];
  const productState = tag ? tags[tag] : collections[collectionId];

  return { ...productState, products: _.map((productState || {}).productIds, id => products[id]) };
};
