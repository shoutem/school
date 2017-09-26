import React from 'react';

import {
  Button,
  Divider,
  Heading,
  Icon,
  Image,
  Overlay,
  Subtitle,
  Text,
  Tile,
  Title,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

import ListItem from './ListItem';

const getDiscount = (price, originalPrice) =>
    Math.round((100 * (price - originalPrice)) / originalPrice);

const FeaturedItem = ({ item, onAddToCart, onPress, shop }) => {
  const { images, minimum_price, minimum_compare_at_price, title } = item;
  const { currency = '' } = shop;

  return (
    <TouchableOpacity onPress={onPress}>
      <View styleName="sm-gutter featured">
        <Image
          styleName="featured"
          source={{ uri: (images[0] || {}).src }}
          defaultSource={require('../assets/images/image-fallback.png')}
        >
          <Tile>
            { minimum_compare_at_price ?
              <Overlay styleName="image-overlay">
                <Heading>
                  {`-${getDiscount(parseInt(minimum_price, 10),
                    parseInt(minimum_compare_at_price, 10))}%`}
                </Heading>
              </Overlay>
              :
              null
            }
            <Title styleName="md-gutter-top">{title}</Title>
            { minimum_compare_at_price ?
              <Subtitle styleName="line-through sm-gutter-top">
                {`${minimum_compare_at_price} ${currency}`}
              </Subtitle>
              :
              null
            }
            <Heading styleName="md-gutter-top">{ `${minimum_price} ${currency}` }</Heading>
            <Button
              styleName="md-gutter-top"
              onPress={onAddToCart}
            >
              <Icon name="cart" />
              <Text>ADD TO CART</Text>
            </Button>
          </Tile>
        </Image>
      </View>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
};

FeaturedItem.propTypes = {
  ...ListItem.propTypes,
};

export default connectStyle(ext('FeaturedItem'))(FeaturedItem);
