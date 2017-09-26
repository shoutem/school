// Constants `screens` and `reducer` are exported via named export
// It is important to use those exact names

import CartScreen from './screens/CartScreen.js';
import ProductsGridScreen from './screens/ProductsGridScreen.js';
import ProductsListScreen from './screens/ProductsListScreen.js';
import SearchProductsScreen from './screens/SearchProductsScreen.js';
import ProductDetailsScreen from './screens/ProductDetailsScreen.js';
import UpdateItemScreen from './screens/UpdateItemScreen.js';

import CheckoutScreen from './screens/checkout/CheckoutScreen';
import ShippingMethodScreen from './screens/checkout/ShippingMethodScreen';
import PaymentScreen from './screens/checkout/PaymentScreen';
import OrderCompleteScreen from './screens/checkout/OrderCompleteScreen';

import { actions, reducer } from './redux';

export const screens = {
  CartScreen,
  ProductsGridScreen,
  ProductsListScreen,
  SearchProductsScreen,
  ProductDetailsScreen,
  UpdateItemScreen,
  CheckoutScreen,
  ShippingMethodScreen,
  PaymentScreen,
  OrderCompleteScreen,
};

export { appDidMount } from './app';

export {
  actions,
  reducer,
};
