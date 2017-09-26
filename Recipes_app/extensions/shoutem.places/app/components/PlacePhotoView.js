import React, { Component } from 'react';
import {
  TouchableOpacity,
  Caption,
  Image,
  Divider,
  Tile,
  Title,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { Favorite } from 'shoutem.favorites';
import { ext } from '../const';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';

export class PlacePhotoView extends Component {
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
    const imageSource = place.image ? { uri: place.image.url } : undefined;

    return (
      <TouchableOpacity
        onPress={onPress}
      >
        <Divider styleName="line" />
        <Image
          styleName="large-banner placeholder"
          source={imageSource}
        >
          <Tile>
            <View virtual styleName="actions">
              <Favorite
                item={place}
                schema={schema}
              />
            </View>
            <Title styleName="vertical" numberOfLines={2}>{place.name.toUpperCase()}</Title>
            <Caption styleName="vertical">{formattedAddress}</Caption>
          </Tile>
        </Image>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

const styledComponent = connectStyle(ext('PlacePhotoView'))(PlacePhotoView);

export default withOpenPlaceDetails(styledComponent);
