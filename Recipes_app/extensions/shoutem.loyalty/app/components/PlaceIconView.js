import React, {
  Component,
} from 'react';

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

import { ext, PLACES_SCHEMA } from '../const';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';
import { placeShape } from './shapes';

const DEFAULT_IMAGE = require('../assets/data/no_image.png');

const { func, number } = React.PropTypes;

/**
 * Renders a single place in a list.
 */
class PlaceIconView extends Component {
  static propTypes = {
    // The place
    place: placeShape.isRequired,
    // Points for this place
    points: number,
    // Called when place is pressed
    onPress: func,
  };

  render() {
    const { place, points, onPress } = this.props;
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
              <Caption>{`${points || 'No'} points collected`}</Caption>
            </View>
          </View>
          <Favorite
            item={place}
            schema={PLACES_SCHEMA}
          />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

const styledComponent = connectStyle(ext('PlaceIconView'))(PlaceIconView);

export default withOpenPlaceDetails(styledComponent);
