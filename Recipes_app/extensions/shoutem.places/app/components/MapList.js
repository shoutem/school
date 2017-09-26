import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import _ from 'lodash';
import {
  View,
} from '@shoutem/ui';
import { MapView, EmptyStateView } from '@shoutem/ui-addons';
import { ext } from '../const';
import PlaceIconView from '../components/PlaceIconView';

export class MapList extends Component {

  constructor(props) {
    super(props);
    const { selectedPlace } = this.props;

    this.createMarkersFromPlaces = this.createMarkersFromPlaces.bind(this);
    this.renderImageRow = this.renderImageRow.bind(this);
    this.findSelectedPlace = this.findSelectedPlace.bind(this);
    this.setSelectedMarker = this.setSelectedMarker.bind(this);
    this.refreshMarkers = this.refreshMarkers.bind(this);
    this.state = {
      ...this.state,
      schema: ext('places'),
      selectedMarker: this.createMarker(selectedPlace),
    };
  }

  componentWillMount() {
    const { places } = this.props;

    const markers = this.createMarkersFromPlaces(places);
    const region = _.isEmpty(markers) ? undefined : this.resolveInitialRegion(markers);

    LayoutAnimation.easeInEaseOut();
    this.setState({ markers, region });
  }

  componentWillReceiveProps(newProps) {
    const { places } = newProps;
    const oldPlaces = this.props.places;

    if (places !== oldPlaces) {
      this.refreshMarkers(places);
    }
  }

  setSelectedMarker(selectedMarker) {
    LayoutAnimation.easeInEaseOut();
    this.setState({ selectedMarker });
  }

  /**
   * Takes new set of places to render ( after we detect the change via new props),
   * and creates new markers based on the same. Also, if there was a place selected,
   * we check if the same place is present in the new set, and if not, we make sure to "reset"
   * the selected marker
   *
   * @param places {array} Array of places to display on map.
   */
  refreshMarkers(places) {
    const { selectedMarker } = this.state;

    // If there was a marker selected, check if the marked place
    // Is still present in the current data set. Reset the marker export
    // do nothing accordingly.
    if (selectedMarker) {
      const markedPlace = this.findSelectedPlace(places);

      if (!markedPlace) {
        this.setSelectedMarker(undefined);
      }
    }
    const markers = this.createMarkersFromPlaces(places);

    LayoutAnimation.easeInEaseOut();
    this.setState({ markers });
  }

  resolveInitialRegion(markers) {
    const { initialRegion } = this.props;

    const defaultRegion = {
      ..._.first(markers),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return initialRegion || defaultRegion;
  }

  createMarker(place) {
    if (!place) {
      return undefined;
    }

    const { location = {} } = place;
    const { latitude, longitude } = location;

    if (latitude && longitude) {
      return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        placeId: place.id,
      };
    }
    return undefined;
  }

  createMarkersFromPlaces(places) {
    return _.reduce(places, (result, place) => {
      const marker = this.createMarker(place);

      if (marker) {
        result.push(marker);
      }
      return result;
    },
    []);
  }

  findSelectedPlace(places) {
    const { selectedMarker } = this.state;

    if (!selectedMarker) {
      return null;
    }
    const selectedPlace = places.find(place => place.id === selectedMarker.placeId);

    return selectedPlace;
  }

  renderImageRow() {
    const { places } = this.props;

    const returnedPlace = this.findSelectedPlace(places);

    return <PlaceIconView place={returnedPlace} />;
  }

  render() {
    const { selectedMarker, markers, region } = this.state;
    const printImageRow = (selectedMarker) ? this.renderImageRow() : null;

    if (_.isEmpty(markers)) {
      return (
        <EmptyStateView
          icon="address-full"
          message="None of your items have a location property set"
        />
      );
    }

    return (
      <View styleName="flexible">
        <View styleName="flexible">
          <MapView
            markers={markers}
            onMarkerPressed={this.setSelectedMarker}
            initialRegion={region}
            selectedMarker={selectedMarker}
          />
        </View>
        {printImageRow}
      </View>
    );
  }
}

export default connectStyle(ext('MapList'))(MapList);

MapList.propTypes = {
  places: React.PropTypes.array.isRequired,
  selectedPlace: React.PropTypes.object,
  initialRegion: React.PropTypes.object,
};

MapList.defaultProps = {
  selectedPlace: undefined,
  initialRegion: undefined,
};
