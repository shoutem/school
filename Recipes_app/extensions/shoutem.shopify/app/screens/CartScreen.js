import React, {
  Component,
} from 'react';

import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Caption,
  Divider,
  Icon,
  ListView,
  Screen,
  ScrollView,
  Subtitle,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { NavigationBar } from '@shoutem/ui/navigation';

import {
  closeModal,
  openInModal,
} from '@shoutem/core/navigation';

import { ext } from '../const';
import CartFooter from '../components/CartFooter';
import CartItem from '../components/CartItem';
import UpdateItemScreen from './UpdateItemScreen';

import {
  cart as cartShape,
  shop as shopShape,
} from '../components/shapes';

import {
  cartItemRemoved,
  cartItemUpdated,
  startCheckout,
} from '../redux/actionCreators';

const { func } = React.PropTypes;

/**
 * Displays a list of items that the user has added to his cart, the total price, and
 * a button that lets him proceed to checkout
 */
class CartScreen extends Component {
  static propTypes = {
    // A list of cart items, where an item is defined by a combination of product, its variant
    // and quantity
    cart: cartShape.isRequired,
    // Action dispatched when an item is removed from the cart
    cartItemRemoved: func.isRequired,
    // Action dispatched when a cart item is updated
    cartItemUpdated: func.isRequired,
    // Used to close modal after a cart item has been updated
    closeModal: func,
    // Used to open the edit cart item screen in modal
    openInModal: func,
    // Shop properties, currently used just to display currency
    shop: shopShape.isRequired,
    // Dispatched when the user starts a checkout
    startCheckout: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.proceedToCheckout = this.proceedToCheckout.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.state = { selectedItem: null };
  }

  onItemUpdated(actionType, cartItem, updates) {
    const { cartItemRemoved, cartItemUpdated, closeModal } = this.props;
    const { remove } = UpdateItemScreen.actionTypes;

    if (actionType === remove) {
      cartItemRemoved(cartItem);
    } else {
      const { variant: newVariant, quantity } = updates;
      cartItemUpdated(cartItem, newVariant, quantity);
    }

    closeModal();
  }

  onEditItem(cartItem) {
    const { openInModal } = this.props;
    const { item, variant, quantity } = cartItem;

    const route = {
      screen: ext('UpdateItemScreen'),
      props: {
        item,
        variant,
        quantity,
        onActionButtonClicked: (actionType, updates) =>
          this.onItemUpdated(actionType, cartItem, updates),
      },
    };
    openInModal(route);
  }

  proceedToCheckout() {
    const { cart, startCheckout } = this.props;

    startCheckout(cart);
  }

  renderRow(cartItem) {
    const { shop } = this.props;

    return (
      <TouchableOpacity onPress={() => this.onEditItem(cartItem)}>
        <CartItem cartItem={cartItem} shop={shop} />
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  renderContent() {
    const { cart } = this.props;

    return (
      <Screen>
        <Divider styleName="section-header">
          <Caption>PRODUCT NAME</Caption>
          <Caption>PRICE</Caption>
        </Divider>
        <ScrollView>
          <ListView
            data={cart}
            renderRow={this.renderRow}
          />
        </ScrollView>
        <Divider styleName="line" />
        <CartFooter
          action="PROCEED TO CHECKOUT"
          onActionButtonClicked={this.proceedToCheckout}
        />
      </Screen>
    );
  }

  render() {
    const { cart } = this.props;

    return (
      <Screen>
        <NavigationBar
          title="SHOPPING CART"
        />
        { _.size(cart) ? this.renderContent() : renderEmptyScreen()}
      </Screen>
    );
  }
}

const renderEmptyScreen = () => (
  <View styleName="flexible vertical h-center v-center xl-gutter-horizontal">
    <View styleName="oval-highlight">
      <Icon name="cart" />
    </View>
    <Subtitle styleName="h-center md-gutter-top xl-gutter-horizontal">
      {'You haven\'t added any products yet.'}
    </Subtitle>
  </View>
);

const mapStateToProps = (state) => {
  const { cart, shop } = state[ext()];

  return {
    cart,
    shop,
  };
};

const mapDispatchToProps = {
  cartItemRemoved,
  cartItemUpdated,
  closeModal,
  openInModal,
  startCheckout,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('CartScreen'))(CartScreen),
);
