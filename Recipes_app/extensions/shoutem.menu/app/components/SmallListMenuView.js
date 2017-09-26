import React from 'react';
import * as _ from 'lodash';

import {
  Image,
  Subtitle,
  Row,
  View,
  Divider,
  TouchableOpacity,
} from '@shoutem/ui';

export default class SmallListMenuView extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    item: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.item);
  }

  render() {
    const { item } = this.props;

    return (
      <TouchableOpacity
        onPress={this.onPress}
        key={item.id}
      >
        <Row>
          <Image
            styleName="small placeholder"
            source={{ uri: _.get(item, 'image.url') }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{item.name}</Subtitle>
            <Subtitle>{item.price}</Subtitle>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
