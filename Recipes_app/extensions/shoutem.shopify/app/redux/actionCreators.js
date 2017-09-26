import _ from 'lodash';
import { Alert } from 'react-native';
import Shopify from 'react-native-shopify';

import {
  navigateTo,
  openInModal,
} from '@shoutem/core/navigation';

import { ext, PAGE_SIZE } from '../const';
import { getProducts } from './selectors';

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
  CHECKOUT_STARTED,
  CUSTOMER_INFORMATION_UPDATED,
  SHIPPING_METHODS_LOADING,
  SHIPPING_METHODS_LOADED,
  SHIPPING_METHOD_SELECTED,
  SHIPPING_METHODS_ERROR_LOADING,
  PAYMENT_PROCESSING,
  CHECKOUT_COMPLETED,
  APP_MOUNTED,
} from './actionTypes';

/**
 * @see SHOP_LOADING
 * Used to notify that shop information is being loaded
 * @returns {{ type: String }}
 */
export function shopLoading() {
  return {
    type: SHOP_LOADING,
  };
}

/**
 * @see SHOP_LOADED
 * Used for setting shop information
 * @param collections - Collections from Shopify, used to group products
 * @param shop - Basic shop information such as currency
 * @param tags - Shopify product tags, used to filter them
 * @returns {{ type: String, payload: { collections: [], currency: String, tags: [] }}}
 */
export function shopLoaded(collections, shop, tags) {
  return {
    type: SHOP_LOADED,
    payload: {
      collections,
      ...shop,
      tags,
    },
  };
}

/**
 * @see SHOP_ERROR_LOADING
 * Used to notify that shop information couldn't be loaded
 * @returns {{ type: String }}
 */
export function shopErrorLoading() {
  return {
    type: SHOP_ERROR_LOADING,
  };
}

/**
 * @see CART_ITEM_ADDED
 * Used for adding an item to the cart
 * @param cartItem - New item
 * @returns {{ type: String, payload: { cartItem: {} } }}
 */
export function cartItemAdded(cartItem) {
  return {
    type: CART_ITEM_ADDED,
    payload: cartItem,
  };
}

/**
 * @see CART_ITEM_REMOVED
 * Used for removing an item from the cart
 * @param cartItem - Item to remove
 * @returns {{ type: String, payload: { cartItem: {} }}}
 */
export function cartItemRemoved(cartItem) {
  return {
    type: CART_ITEM_REMOVED,
    payload: cartItem,
  };
}

/**
 * @see CART_ITEM_UPDATED
 * Used for updating an item already in the cart
 * @param cartItem - Item to update
 * @param variant - New variant
 * @param quantity - New quantity
 * @returns {{ type: String, payload: { cartItem: {}, variant: {}, quantity: {} } }}
 */
export function cartItemUpdated(cartItem, variant, quantity) {
  return {
    type: CART_ITEM_UPDATED,
    payload: {
      cartItem,
      variant,
      quantity,
    },
  };
}

/**
 * @see PRODUCTS_LOADING
 * Used to notify that new products are being loaded
 * @param collectionId - ID of the collection for which products are loading
 * @param tag - Tag for which products are loading
 * @returns {{ type: String, payload: { collectionId: number, tag: string } }}
 */
export function productsLoading(collectionId, tag) {
  return {
    type: PRODUCTS_LOADING,
    payload: {
      collectionId,
      tag,
    },
  };
}

/**
 * @see PRODUCTS_ERROR
 * Used to notify that products couldn't be loaded
 * @param collectionId - ID of the collection used to fetch products
 * @param tag - Tag used to fetch products
 * @returns {{ type: String, payload: { collectionId: number, tag: string } }}
 */
export function productsError(collectionId, tag) {
  return {
    type: PRODUCTS_ERROR,
    payload: {
      collectionId,
      tag,
    },
  };
}

/**
 * @see PRODUCTS_LOADED
 * Used to notify that new products have been loaded
 * @param products - Products from Shopify
 * @param collectionId - ID of the collection these products belong to
 * @param tag - Tag associated with these products
 * @param page - Page to which results belong on Shopify
 * @param resetMode - If true, new products should replace existing ones, and otherwise
 *  they are added at the end
 * @returns {{ type: String, payload: { products: [], collectionId: number, tag: string,
 *   page: number, resetMode: boolean }}}
 */
export function productsLoaded(products, collectionId, tag, page, resetMode) {
  return {
    type: PRODUCTS_LOADED,
    payload: {
      products,
      collectionId,
      tag,
      page,
      resetMode,
    },
  };
}

/**
 * Used to fetch new products based on selected collection and tag
 * @param collectionId - ID of the collection for which to refresh products
 * @param tag - Tag used for filtering
 * @param resetMode - If true, new products should replace existing ones, and otherwise
 * they are added at the end
 * @returns {{ type: function }}
 */
export function refreshProducts(collectionId = 0, tag, resetMode) {
  return (dispatch, getState) => {
    dispatch(productsLoading(collectionId, tag));

    // We get the last loaded page from Shopify, which is 0 if we don't have any products
    // for this combination of tag and collection
    const { page = 0 } = getProducts(getState(), collectionId, tag);
    const nextPage = resetMode ? 1 : page + 1;

    return Shopify.getProducts(nextPage, collectionId, tag && [tag])
    .then((products) => {
      console.log(products);

      // If we got less products than the page size, we need to ask for the same page next time
      // to get recently added products
      const lastLoadedPage = _.size(products) < PAGE_SIZE ? nextPage - 1 : nextPage;

      dispatch(productsLoaded(products, collectionId, tag, lastLoadedPage, resetMode));
    }).catch((error) => {
      console.log(error);
      dispatch(productsError(collectionId, tag));
    });
  };
}

/**
 * Used to start a checkout
 * @param cart - Cart items
 * @returns {{ type: function }}
 */
export function startCheckout(cart) {
  return (dispatch) => {
    dispatch(checkoutStarted(cart));

    Shopify.checkout(_.cloneDeep(cart)).then(() => {
      const route = {
        screen: ext('CheckoutScreen'),
      };
      dispatch(openInModal(route));
    }).catch((error) => {
      Alert.alert(
        'Error with checkout',
        error.message,
      );
    });
  };
}

/**
 * @see CHECKOUT_STARTED
 * Used to notify that a checkout has started
 * @param cart - Cart items
 * @returns {{ type: String, payload: { cart: [{ item: {}, quantity: number, variant: {} }] }
 */
export function checkoutStarted(cart) {
  return {
    type: CHECKOUT_STARTED,
    payload: {
      cart,
    },
  };
}

/**
 * Used to update customer information and proceed to the next checkout step
 * @param customer - Email and address information
 * @returns {{ type: String, payload: { customer: {} }}
 */
export function updateCustomerInformation(customer) {
  return (dispatch) => {
    const { email, ...addressInformation } = customer;

    Shopify.setCustomerInformation(email, addressInformation).then(() => {
      dispatch(customerInformationUpdated(customer));

      dispatch(navigateTo({
        screen: ext('ShippingMethodScreen'),
      }));
    }).catch((error) => {
      Alert.alert(
        'Error with checkout',
         error.message,
      );
    });
  };
}

/**
 * @see CUSTOMER_INFORMATION_UPDATED
 * Used to notify that the user has saved his email and address during checkout
 * and proceeded to the next step
 * @param customer - Customer information
 * @returns {{ type: String, payload: { customer: {} }}
 */
export function customerInformationUpdated(customer) {
  return {
    type: CUSTOMER_INFORMATION_UPDATED,
    payload: {
      customer,
    },
  };
}

/**
 * Used to fetch new shipping methods, which are a function of selected cart items
 * and customer address.
 * They have to be fetched from Shopify when one of the former is updated.
 * @returns {{ type: function }}
 */
export function refreshShippingMethods() {
  return (dispatch) => {
    dispatch(shippingMethodsLoading());

    return Shopify.getShippingRates().then((shippingMethods) => {
      dispatch(shippingMethodsLoaded(shippingMethods));
    }).catch(() => {
      dispatch(shippingMethodsErrorLoading());
    });
  };
}

/**
 * @see SHIPPING_METHODS_LOADING
 * Used to notify that new shipping methods for active checkout are being loaded from Shopify.
 * @returns {{ type: String }}
 */
export function shippingMethodsLoading() {
  return {
    type: SHIPPING_METHODS_LOADING,
  };
}

/**
 * @see SHIPPING_METHODS_ERROR_LOADING
 * Used to notify that new shipping methods couldn't be loaded.
 * @returns {{ type: String }}
 */
export function shippingMethodsErrorLoading() {
  return {
    type: SHIPPING_METHODS_ERROR_LOADING,
  };
}

/**
 * @see SHIPPING_METHODS_LOADED
 * Used to notify that new shipping methods have been loaded.
 * @returns payload [{ title: string, price: string, deliveryRange: [] }] Shipping methods
 */
export function shippingMethodsLoaded(shippingMethods) {
  return {
    type: SHIPPING_METHODS_LOADED,
    payload: shippingMethods,
  };
}

/**
 * @see SHIPPING_METHOD_SELECTED
 * Used to notify that a shipping method has been selected.
 * @returns payload { title: string, price: string, deliveryRange: [] } Shipping method
 */
export function shippingMethodSelected(method) {
  return {
    type: SHIPPING_METHOD_SELECTED,
    payload: method,
  };
}

/**
 * Selects a new shipping method.
 * @param methodIndex - Selected shipping method index
 * @param methodIndex - Selected shipping method
 * @returns {{ type: function }}
 */
export function selectShippingMethod(method) {
  return (dispatch, getState) => {
    const { shippingMethods: { methods } } = getState()[ext()];

    const selectedMethodIndex = _.findIndex(methods, { 'id': method.id });

    return Shopify.selectShippingRate(selectedMethodIndex).then(() => {
      dispatch(shippingMethodSelected(method));
      dispatch(navigateTo({
        screen: ext('PaymentScreen'),
      }));
    }).catch((error) => {
      console.log(error);
      Alert.alert(
        'Error with checkout',
        'The shipping method couldn\'t be selected.' +
        ' Please try again or contact the store owner.',
      );
    });
  };
}

/**
 * Used to complete a checkout.
 * @param creditCard - Credit card information
 * @returns {{ type: function }}
 */
export function completeCheckout(creditCard) {
  return (dispatch) => {
    dispatch(paymentProcessing(true));

    return Shopify.completeCheckout({ ...creditCard }).then(() => {
      dispatch(paymentProcessing(false));
      dispatch(navigateTo({
        screen: ext('OrderCompleteScreen'),
      }));
    })
    .catch((error) => {
      dispatch(paymentProcessing(false));
      Alert.alert(
        'Error with checkout',
        error.message,
      );
    });
  };
}

/**
 * @see PAYMENT_PROCESSING
 * Used to notify that checkout payment is being processed by the remote gateway.
 * @returns {{ type: String }}
 */
export function paymentProcessing(isProcessing) {
  return {
    type: PAYMENT_PROCESSING,
    payload: {
      isProcessing,
    },
  };
}

/**
 * @see CHECKOUT_COMPLETED
 * Used to notify that checkout has been completed.
 * @returns {{ type: String }}
 */
export function checkoutCompleted() {
  return {
    type: CHECKOUT_COMPLETED,
  };
}

/**
 * @see APP_MOUNTED
 * Used to notify when the app has been mounted
 * @returns {{ type: String }}
 */
export function appMounted() {
  return {
    type: APP_MOUNTED,
  };
}
