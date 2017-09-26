import React from 'react';

import {
  Caption,
  Image,
  Row,
  Subtitle,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import {
  cartItem as cartItemShape,
  shop as shopShape,
} from './shapes';

import { ext } from '../const';

/**
 * Renders a single cart item, with selected variant and quantity for a product
 */
const CartItem = ({ cartItem, shop }) => {
  const { item, variant, quantity } = cartItem;

  const { price, compare_at_price, title } = variant;
  const { images } = item;
  const { currency } = shop;

  return (
    <Row>
      <Image
        styleName="small"
        source={{ uri: (images[0] || {}).src }}
      />
      <View style={{ flex: 7 }}>
        <Subtitle>{item.title}</Subtitle>
        <View styleName="horizontal">
          <Caption
            ellipsizeMode="middle"
            numberOfLines={1}
          >
            {`${title}  ·  Quantity: ${quantity}`}
          </Caption>
        </View>
      </View>
      <View styleName="h-end sm-gutter-left vertical" style={{ flex: 3 }}>
        <Subtitle>{`${price} ${currency}`}</Subtitle>
        <Caption styleName="line-through">
          {compare_at_price ? `${compare_at_price} ${currency}` : ''}
        </Caption>
      </View>
    </Row>
  );
};

CartItem.propTypes = {
  // Cart item, consisting of product, selected variant and quantity
  cartItem: cartItemShape.isRequired,
  // Shop, used to display currency
  shop: shopShape.isRequired,
};

export default connectStyle(ext('CartItem'))(CartItem);
