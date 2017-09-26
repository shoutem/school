import React from 'react';

import {
  Image,
  Subtitle,
  Overlay,
  Title,
  Divider,
  TouchableOpacity,
  Tile,
} from '@shoutem/ui';

export default class ListMenuView extends React.Component {
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
    const price = item.price ? (
      <Overlay style={{ backgroundColor: 'white' }}>
        <Subtitle styleName="sm-gutter-horizontal">{item.price}</Subtitle>
      </Overlay>) : null;

    return (
      <TouchableOpacity key={item.id} onPress={this.onPress}>
        <Image
          styleName="large-banner placeholder"
          source={{ uri: item.image ? item.image.url : undefined }}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">{item.name.toUpperCase()}</Title>
            {price}
          </Tile>
        </Image>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
