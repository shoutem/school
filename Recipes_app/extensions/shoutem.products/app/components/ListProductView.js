import React, {
  Component,
} from 'react';
import _ from 'lodash';

import {
  TouchableOpacity,
  Image,
  View,
  Subtitle,
  Caption,
  Row,
  Divider,
} from '@shoutem/ui';

export default class ListProductView extends Component {
  static propTypes = {
    product: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleItemPress = this.handleItemPress.bind(this);
  }

  handleItemPress() {
    const { product, onPress } = this.props;
    onPress(product);
  }

  render() {
    const { product } = this.props;
    return (
      <TouchableOpacity onPress={this.handleItemPress}>
        <Row>
          <Image
            styleName="small placeholder"
            source={{ uri: _.get(product, 'image.url') }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>{product.name}</Subtitle>
            <View styleName="horizontal">
              <Subtitle>{product.currentPrice}</Subtitle>
              <Caption styleName="line-through sm-gutter-left">{product.oldPrice}</Caption>
            </View>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
