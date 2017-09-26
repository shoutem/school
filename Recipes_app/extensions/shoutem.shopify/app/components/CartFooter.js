import React from 'react';

import { connect } from 'react-redux';

import {
  Button,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { shop as shopShape } from './shapes';

import { ext } from '../const';
import { getCartTotal } from '../redux/selectors';

const renderStatusRow = (cartTotal, { currency }) => (
  <View styleName="horizontal md-gutter space-between">
    <Subtitle>Total price:</Subtitle>
    <Subtitle>
      {`${currency} ${cartTotal}`}
    </Subtitle>
  </View>
);

const renderActionButton = (action, onActionButtonClicked) => (
  <View
    styleName="horizontal h-end md-gutter"
    style={{ paddingTop: 10 }}
  >
    <Button
      onPress={onActionButtonClicked}
      styleName="secondary"
    >
      <Text styleName="bold">{action}</Text>
    </Button>
  </View>
);

/**
 * A component that displays a status row for a cart at checkout, with a total price.
 * Optionally, it has an action button to proceed to the next step.
 */
const CartFooter = ({ action, cartTotal, shop, onActionButtonClicked }) => (
  <View>
    {renderStatusRow(cartTotal, shop)}
    {action ? renderActionButton(action, onActionButtonClicked) : null}
  </View>
);

const { func, string } = React.PropTypes;

CartFooter.propTypes = {
  // Action name, e.g. Proceed to checkout
  action: string,
  // Total price of items in the cart, which can include shipping
  cartTotal: string.isRequired,
  // Function executed when associated action button is clicked, e.g. proceeding to checkout
  onActionButtonClicked: func,
  // Shop, used to display currency
  shop: shopShape.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { shop } = state[ext()];
  const { action, onActionButtonClicked, withShipping } = ownProps;

  return {
    action,
    cartTotal: getCartTotal(state, withShipping),
    onActionButtonClicked,
    shop,
  };
};

export default connect(mapStateToProps, {})(
  connectStyle(ext('CartFooter'))(CartFooter),
);
