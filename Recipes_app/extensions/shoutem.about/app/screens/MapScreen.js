import React, {
  Component,
} from 'react';
import {
  Platform,
  Linking,
} from 'react-native';

import {
  Screen,
  Text,
  Button,
  Icon,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { MapView } from '@shoutem/ui-addons';

export default class MapScreen extends Component {
  static propTypes = {
    marker: React.PropTypes.object,
    title: React.PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.renderNavigateButton = this.renderNavigateButton.bind(this);
    this.openMaps = this.openMaps.bind(this);
  }

  openMaps() {
    const { marker } = this.props;
    const geoURL = `geo:${marker.latitude},${marker.longitude}`;

    Linking.canOpenURL(geoURL).then((supported) => {
      if (supported) {
        Linking.openURL(geoURL);
      } else if (Platform.OS === 'ios') {
        Linking.openURL(`http://maps.apple.com/?ll=${marker.latitude},${marker.longitude}`);
      }
    });
  }

  renderNavigateButton() {
    return (
      <View virtual styleName="container">
        <Button onPress={this.openMaps}>
          <Icon name="directions" />
        </Button>
      </View>
    );
  }

  render() {
    const { marker, title } = this.props;

    const initialRegion = {
      latitude: marker.latitude,
      longitude: marker.longitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    };

    return (
      <Screen styleName="full-screen">
        <NavigationBar
          styleName="no-border"
          title={title.toUpperCase()}
          renderRightComponent={this.renderNavigateButton}
        />

        <MapView
          initialRegion={initialRegion}
          markers={[marker]}
          selectedMarker={marker}
        />
      </Screen>
    );
  }
}
