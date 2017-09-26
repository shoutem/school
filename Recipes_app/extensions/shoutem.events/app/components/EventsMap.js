import React from 'react';
import { LayoutAnimation } from 'react-native';
import _ from 'lodash';

import { MapView } from '@shoutem/ui-addons';
import { View } from '@shoutem/ui';

import ListEventView from '../components/ListEventView';
import isValidEvent from '../shared/isValidEvent';

/**
 * Create markers out of events.
 * Filter events with location and bind event properties.
 *
 * @param events
 * @returns {*}
 */
function getMarkersFromEvents(events) {
  return events.filter(isValidEvent).map(event => ({
    latitude: parseFloat(event.location.latitude),
    longitude: parseFloat(event.location.longitude),
    event,
  }));
}

/**
 * Retrieves initial region from all available events
 * In order to find initial region when we have multiple events, we're calculating mean
 * latitude and longitude values for all events. Also, latitudeDelta and longitudeDelta
 * values are calculated as difference between max latitude (longitude) and min (longitude)
 *
 * @param events
 * @returns {*}
 */

function getCoordinatesDelta(events, coordinateName) {
  return _.maxBy(events, coordinateName)[coordinateName] -
          _.minBy(events, coordinateName)[coordinateName];
}

function getInitialRegionFromEvents(events) {
  const defaultLatitudeDelta = 0.01;
  const defaultLongitudeDelta = 0.01;

  const validEvents = _.map(_.filter(events, isValidEvent), (event) => {
    return {
      latitude: parseFloat(_.get(event, 'location.latitude')),
      longitude: parseFloat(_.get(event, 'location.longitude')),
    };
  });

  if (_.isEmpty(validEvents)) {
    return;
  }

  const latitudeDelta = getCoordinatesDelta(validEvents, 'latitude') || defaultLatitudeDelta;
  const longitudeDelta = getCoordinatesDelta(validEvents, 'longitude') || defaultLongitudeDelta;

  return {
    latitude: _.meanBy(validEvents, 'latitude'),
    longitude: _.meanBy(validEvents, 'longitude'),
    latitudeDelta: latitudeDelta * 1.5,
    longitudeDelta: longitudeDelta * 1.5,
  };
}

function getMarkersAndRegionFromEvents(data) {
  if (!data || _.isEmpty(data)) {
    return {
      markers: [],
      region: undefined,
    };
  }

  return {
    markers: getMarkersFromEvents(data),
    region: getInitialRegionFromEvents(data),
  };
}

export default class EventsMap extends React.Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    style: React.PropTypes.object.isRequired,
    addToCalendar: React.PropTypes.func.isRequired,
    openDetailsScreen: React.PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.handleMapPress = this.handleMapPress.bind(this);
    this.state = {
      selectedEvent: null,
      ...getMarkersAndRegionFromEvents(this.props.data),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        ...getMarkersAndRegionFromEvents(nextProps.data),
      });
    }
  }

  handleMapPress(event) {
    const { selectedEvent } = this.state;
    if (event.nativeEvent.action !== 'marker-press' && selectedEvent) {
      LayoutAnimation.easeInEaseOut();
      this.setState({ selectedEvent: null });
    }
  }

  renderEventListItem(event, style = {}) {
    const { addToCalendar, openDetailsScreen } = this.props;

    return (
      <ListEventView
        event={event}
        onPress={openDetailsScreen}
        action={addToCalendar}
        style={style}
      />
    );
  }

  renderEventsMap() {
    const { markers, region } = this.state;

    return (
      <MapView
        markers={markers}
        initialRegion={region}
        onMarkerPressed={(marker) => {
          LayoutAnimation.easeInEaseOut();
          this.setState({ selectedEvent: marker.event });
        }}
        onPress={this.handleMapPress}
      />
    );
  }

  render() {
    const { style } = this.props;
    const { selectedEvent } = this.state;

    return (
      <View styleName="flexible">
        {this.renderEventsMap()}
        {selectedEvent ? this.renderEventListItem(selectedEvent, style.eventDetails) : null}
      </View>
    );
  }
}
