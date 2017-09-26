import React from 'react';

import {
  Button,
  Icon,
  Text,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

/**
 * Displays a cart icon and a badge with number of items in it (if any).
 */
const CartIcon = ({ cartSize, onPress }) => (
  <Button
    styleName="clear"
    onPress={onPress}
  >
    <Icon name="cart" />
    {cartSize ? getBadge(cartSize) : null}
  </Button>
);

const getBadge = quantity => (
  <View styleName="badge">
    <Text>{quantity < 10 ? quantity : '...' }</Text>
  </View>
);

const { func, number } = React.PropTypes;

CartIcon.propTypes = {
  // Number of items in the cart - a badge with this number will be shown above the cart
  // when there is at least one item in it
  cartSize: number.isRequired,
  // Called when the cart is clicked and has items in it
  onPress: func.isRequired,
};

export default connectStyle(ext('CartIcon'), {}, () => {},
  { virtual: true })(CartIcon);
