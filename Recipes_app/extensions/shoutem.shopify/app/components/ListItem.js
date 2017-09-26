import React from 'react';

import {
  Button,
  Caption,
  Divider,
  Icon,
  Image,
  Subtitle,
  Row,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import {
  product as productShape,
  shop as shopShape,
} from './shapes';

import { ext } from '../const';

const ListItem = ({ item, onAddToCart, onPress, shop }) => {
  const { images, minimum_price, minimum_compare_at_price, title } = item;
  const { currency = '' } = shop;

  // TODO: Format currency in locale
  return (
    <TouchableOpacity onPress={onPress}>
      <Row>
        <Image
          styleName="small"
          source={{ uri: (images[0] || {}).src }}
          defaultSource={require('../assets/images/image-fallback.png')}
        />
        <View styleName="vertical stretch space-between">
          <Subtitle>{title}</Subtitle>
          <View styleName="horizontal">
            <Subtitle
              styleName="md-gutter-right"
            >
              {`${minimum_price} ${currency}`}
            </Subtitle>
            <Caption styleName="line-through">
              {minimum_compare_at_price ? `${minimum_compare_at_price} ${currency}` : ''}
            </Caption>
          </View>
        </View>
        <Button
          onPress={onAddToCart}
          styleName="right-icon"
        >
          <Icon name="add-to-cart" />
        </Button>
      </Row>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
};

const { func } = React.PropTypes;

ListItem.propTypes = {
  // Product
  item: productShape.isRequired,
  // Called when item is added to cart
  onAddToCart: func,
  // Called when item is pressed
  onPress: func,
  // Shop, used to display currency
  shop: shopShape.isRequired,
};

export default connectStyle(ext('ListItem'))(ListItem);
