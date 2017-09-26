import React from 'react';

const { arrayOf, bool, number, oneOfType, shape, string } = React.PropTypes;

const variant = shape({
  // Price of this variant of the product, for example Blue Small size shirt
  price: string,
  // Price of this variant with competitors, set in Shopify store and
  // used to show discounts
  compare_at_price: string,
});

const product = shape({
  // Product description
  body_html: string,
  // Product images, displayed in thumbnails and a gallery in the details page
  images: arrayOf(shape({
    src: string,
  })),
  // Minimum price of all product variants, returned by the SDK
  minimum_price: string,
  // Minimum price of all product variants with competitors, returned by the SDK
  minimum_compare_at_price: string,
  // Unique ID of the product
  product_id: oneOfType([number, string]),
  // Product title
  title: string,
  // All variants that this product has, where a variant is a combination of options,
  // for example a White Small Plain shirt or Blue Medium Striped shirt
  variants: arrayOf(variant),
});

const cartItem = shape({
  // The product for which a variant is added to the cart, for example Hugo Boss shirts
  item: product,
  // The selected variant, for example a White Small shirt
  variant,
  // The number of items (variants) added
  quantity: number,
});

const cart = arrayOf(cartItem);

const collection = shape({
  // Id of a collection, used to group products, from Shopify
  id: number,
  // Collection title
  title: string,
});

const customer = shape({
  // Used to notify customer of a successful order and upsell him
  email: string,
  // First name
  firstName: string,
  // Last name, mandatory together with first name when performing checkout
  lastName: string,
  // Customer address, used to calculate shipping rates and fullfill the order
  address1: string,
  // Customer city, used together with the address
  city: string,
  // Customer country code, for example US for USA or HR for Croatia, used to
  // determine shipping zones at checkout
  countryCode: string,
  // Customer postal code, used together with the address
  zip: string,
});

const payment = shape({
  card: shape({
    // Credit card number
    number: string,
    // First name on card
    firstName: string,
    // Last name on card
    lastName: string,
    // 2 digit expiry month, for example '06'
    expiryMonth: string,
    // 2 digit expiry month, for example '17'
    expiryYear: string,
    // 3 digit verification value, found on back of the card
    cvv: string,
  }),
   // True when the payment is being processed by the remote gateway, false otherwise
  isProcessing: bool,
});

const shippingMethod = shape({
  // Estimated range for delivery, which consists of two items: the earliest and latest date,
  // specified in miliseconds from 1970
  deliveryRange: arrayOf(number),
  // Shipping rate's unique identifier on Shopify
  id: string,
  // Price for this shipping method in store's currency
  price: string,
  // Title, for example: 'Standard shipping'
  title: string,
});

const shippingMethods = shape({
  // Whether there was an error while loading shipping methods
  error: bool,
  // Whether we are loading new shipping methods
  isLoading: bool,
  // Shipping methods from Shopify
  methods: arrayOf(shippingMethod),
});

const shop = shape({
  // Currency code set in store, and used to display product prices and shipping rates
  currency: string,
  // All collections for this shop that are visible in the mobile app sales channel
  collections: arrayOf(collection),
  // All product tags
  tags: arrayOf(string),
});

export { cart, cartItem, collection, customer, payment, product, shippingMethod,
    shippingMethods, shop, variant };
