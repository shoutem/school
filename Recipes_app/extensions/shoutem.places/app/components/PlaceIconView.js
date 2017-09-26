import React, { Component } from 'react';
import {
  TouchableOpacity,
  Caption,
  Image,
  Divider,
  Row,
  Subtitle,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { Favorite } from 'shoutem.favorites';
import { ext } from '../const';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';

const DEFAULT_IMAGE = require('../assets/data/no_image.png');

export class PlaceIconView extends Component {
  static propTypes = {
    place: React.PropTypes.object.isRequired,
    onPress: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      schema: ext('places'),
    };
  }

  render() {
    const { place, onPress } = this.props;
    const { schema } = this.state;
    const { location = {} } = place;
    const { formattedAddress = '' } = location;
    const imageSource = place.image ? { uri: place.image.url } : DEFAULT_IMAGE;

    return (
      <TouchableOpacity onPress={onPress}>
        <Row>
          <Image
            styleName="small rounded-corners"
            source={imageSource}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{place.name}</Subtitle>
            <View styleName="horizontal">
              <Caption>{formattedAddress}</Caption>
            </View>
          </View>
          <Favorite
            item={place}
            schema={schema}
          />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

const styledComponent = connectStyle(ext('PlaceIconView'))(PlaceIconView);

export default withOpenPlaceDetails(styledComponent);
