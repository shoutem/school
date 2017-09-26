import React, { PureComponent } from 'react';
import {
  View,
  Screen,
  TouchableOpacity,
  Icon,
} from '@shoutem/ui';
import { Linking, Platform } from 'react-native';
import { NavigationBar } from '@shoutem/ui/navigation';
import MapList from '../components/MapList';

export default class SinglePlaceMap extends PureComponent {
  static propTypes = {
    place: React.PropTypes.object,
    title: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.openMapLink = this.openMapLink.bind(this);
    this.renderRightNavBarComponent = this.renderRightNavBarComponent.bind(this);
  }

  getNavBarProps() {
    return {
      title: this.props.title.toUpperCase() || '',
      renderRightComponent: this.renderRightNavBarComponent,
    };
  }

  openMapLink() {
    const { location = {} } = this.props.place;
    const { latitude, longitude, formattedAddress } = location;

    const resolvedScheme = (Platform.OS === 'ios') ?
    `http://maps.apple.com/?ll=${latitude},${longitude}&q=${formattedAddress}` :
    `geo:${latitude},${longitude}?q=${formattedAddress}`;

    if (latitude && longitude) {
      Linking.openURL(resolvedScheme);
    }
  }

  renderRightNavBarComponent() {
    return (
      <View styleName="container md-gutter-right">
        <TouchableOpacity
          onPress={this.openMapLink}
        >
          <Icon name="directions" />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { place } = this.props;

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        <MapList
          places={[place]}
          selectedPlace={place}
        />
      </Screen>
    );
  }
}
