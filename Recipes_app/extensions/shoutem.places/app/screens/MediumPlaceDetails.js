import React from 'react';
import { connect } from 'react-redux';

import {
  ScrollView,
  Caption,
  Title,
  Image,
  Screen,
  Tile,
  View,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { navigateTo } from '@shoutem/core/navigation';
import { NavigationBar } from '@shoutem/ui/navigation';
import { Favorite } from 'shoutem.favorites';
import { openURL } from 'shoutem.web-view';
import { ext } from '../const';

import { PlaceDetails } from './PlaceDetails';

class MediumPlaceDetails extends PlaceDetails {
  static propTypes = {
    ...PlaceDetails.PropTypes,
  };

  getNavBarProps() {
    const { place } = this.props;
    const { schema } = this.state;

    return {
      renderRightComponent: () => (
        <View virtual styleName="container">
          <Favorite
            item={place}
            navBarButton
            schema={schema}
          />
        </View>
      ),
      styleName: place.image ? 'clear' : 'no-border',
      animationName: place.image ? 'solidify' : 'boxing',
      title: place.name,
    };
  }

  renderLeadImage(place) {
    if (place.image) {
      return (
        <Image
          styleName="large"
          source={{ uri: place.image.url }}
          animationName="hero"
        />
      );
    }
    return null;
  }

  renderPlaceInfo(place) {
    const { location = {} } = place;
    const { formattedAddress = '' } = location;

    return (
      <Tile styleName="text-centric">
        <Title
          styleName={`md-gutter-bottom ${place.image ? '' : 'xl-gutter-top'}`}
          numberOfLines={3}
        >
          {place.name.toUpperCase()}
        </Title>
        <Caption styleName="centered sm-gutter-top lg-gutter-bottom">{formattedAddress}</Caption>
      </Tile>
    );
  }

  render() {
    const { place } = this.props;
    const { location = {} } = place;
    return (
      <Screen styleName="full-screen paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderLeadImage(place)}
          {this.renderPlaceInfo(place)}
          {this.renderOpeningHours(place)}
          {this.renderInlineMap(place)}
          {this.renderDescription(place)}
          {this.renderDisclosureButton(place.url, 'Visit webpage', 'web', this.openWebLink)}
          {this.renderDisclosureButton(location.formattedAddress, 'Directions', 'pin', this.openMapLink)}
          {this.renderDisclosureButton(place.mail, 'Email', 'email', this.openEmailLink)}
          {this.renderDisclosureButton(place.phone, 'Phone', 'call', this.openPhoneLink)}
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(undefined, { navigateTo, openURL })(
    connectStyle(ext('MediumPlaceDetails'))(MediumPlaceDetails),
  );
