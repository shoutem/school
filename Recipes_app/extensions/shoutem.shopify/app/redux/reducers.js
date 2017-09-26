import { combineReducers } from 'redux';
import _ from 'lodash';

import {
  SHOP_LOADING,
  SHOP_LOADED,
  SHOP_ERROR_LOADING,
  CART_ITEM_ADDED,
  CART_ITEM_REMOVED,
  CART_ITEM_UPDATED,
  PRODUCTS_ERROR,
  PRODUCTS_LOADING,
  PRODUCTS_LOADED,
  CUSTOMER_INFORMATION_UPDATED,
  SHIPPING_METHODS_LOADING,
  SHIPPING_METHODS_LOADED,
  SHIPPING_METHODS_ERROR_LOADING,
  SHIPPING_METHOD_SELECTED,
  PAYMENT_PROCESSING,
  CHECKOUT_COMPLETED,
  APP_MOUNTED,
} from './actionTypes';

const addItemToCart = (cart, { item, variant, quantity }) => {
  const variantIndex = _.findIndex(cart, cartItem => cartItem.variant.id === variant.id);

  if (variantIndex > -1) {
    return cart.map((item, index) => {
      if (index === variantIndex) {
        const existingCartItem = cart[index];
        return { ...existingCartItem, quantity: existingCartItem.quantity + quantity };
      }
      return item;
    });
  }
  return [...cart, { item, variant, quantity }];
};

const removeItemFromCart = (cart, { variant }) => {
  const variantIndex = _.findIndex(cart, cartItem => cartItem.variant.id === variant.id);
  return cart.filter((item, index) => index !== variantIndex);
};

const updateCartItem = (cart, { cartItem: originalItem, variant, quantity }) => {
  const variantIndex = _.findIndex(cart, cartItem =>
    cartItem.variant.id === originalItem.variant.id);

  return cart.map((item, index) => {
    if (index === variantIndex) {
      return { ...originalItem, variant, quantity };
    }

    return item;
  });
};

const cart = (state = [], action) => {
  switch (action.type) {
    case CART_ITEM_ADDED:
      return addItemToCart(state, action.payload);
    case CART_ITEM_REMOVED:
      return removeItemFromCart(state, action.payload);
    case CART_ITEM_UPDATED:
      return updateCartItem(state, action.payload);
    case CHECKOUT_COMPLETED:
      return [];
    default:
      return state;
  }
};

const customer = (state = {}, action) => {
  switch (action.type) {
    case CUSTOMER_INFORMATION_UPDATED:
      return action.payload.customer;
    default:
      return state;
  }
};

const products = (state = {}, action) => {
  switch (action.type) {
    case PRODUCTS_LOADED:
      return { ...state, ...(_.keyBy(action.payload.products, 'product_id')) };
    default:
      return state;
  }
};

const payment = (state = {}, action) => {
  switch (action.type) {
    case PAYMENT_PROCESSING:
      return {
        ...state,
        isProcessing: action.payload.isProcessing,
      };
    default:
      return state;
  }
};

const productIdsForKey = (state = {}, { products, page, resetMode }, key) => {
  const existingProductIds = state[key] ? state[key].productIds : [];
  const newProductIds = _.map(products, 'product_id');

  return {
    ...state,
    [key]: {
      page,
      productIds: resetMode ? newProductIds : _.union(existingProductIds, newProductIds),
    },
  };
};

const productsStatus = (state = {}, key, isLoading, error) => {
  return {
    ...state,
    [key]: {
      ...state[key],
      isLoading,
      error,
    },
  };
};

const productsForKey = keyName => (state = {}, action) => {
  const { payload = {}, type } = action;
  const key = payload[keyName];

  // If key is not defined, such as collection ID for tag search or vice versa,
  // don't store anything
  if (key === undefined) {
    return state;
  }

  switch (type) {
    case PRODUCTS_LOADED:
      return productIdsForKey(state, payload, key);
    case PRODUCTS_LOADING:
      return productsStatus(state, key, true);
    case PRODUCTS_ERROR:
      return productsStatus(state, key, false, true);
    case APP_MOUNTED:
      return resetPages(state);
    default:
      return state;
  }
};

const resetPages = (state) => {
  return _.mapValues(state, productsStatus => ({ ...productsStatus, page: 0 }));
};

const selectedShippingMethod = (state = {}, action) => {
  switch (action.type) {
    case SHIPPING_METHOD_SELECTED:
      return action.payload;
    default:
      return state;
  }
};

const shippingMethods = (state = {}, action) => {
  switch (action.type) {
    case SHIPPING_METHODS_LOADING:
      return {
        isLoading: true,
      };
    case SHIPPING_METHODS_LOADED:
      return {
        methods: action.payload,
      };
    case SHIPPING_METHODS_ERROR_LOADING:
      return {
        error: true,
      };
    default:
      return state;
  }
};

const shop = (state = {}, action) => {
  switch (action.type) {
    case SHOP_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case SHOP_LOADED:
      return {
        error: false,
        isLoading: false,
        ...action.payload,
      };
    case SHOP_ERROR_LOADING:
      return {
        error: true,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default combineReducers({
  cart,
  collections: productsForKey('collectionId'),
  customer,
  payment,
  products,
  selectedShippingMethod,
  shippingMethods,
  shop,
  tags: productsForKey('tag'),
});
