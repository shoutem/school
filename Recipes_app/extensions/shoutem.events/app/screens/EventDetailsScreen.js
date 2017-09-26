import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';

import {
  ScrollView,
  Screen,
  Title,
  Caption,
  Icon,
  Html,
  View,
  Button,
  Text,
  Divider,
  TouchableOpacity,
  Row,
  Subtitle,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';
import { InlineMap } from '@shoutem/ui-addons';

import { navigateTo as navigateToAction } from '@shoutem/core/navigation';
import { openURL as openUrlAction } from 'shoutem.web-view';

import { formatDate, addToCalendar } from '../shared/Calendar';
import { ext } from '../const';
import isValidEvent from '../shared/isValidEvent';

/**
 * Extracts `coordinate` value for given event.
 *
 * @param event
 * @returns {*}
 */
const getEventLocationCoordinate = (event, coordinate) => (
  parseFloat(_.get(event, `location.${coordinate}`))
);

/**
 * Extracts location into marker out of event.
 *
 * @param event
 * @returns {*}
 */
const getEventLocation = event => ({
  latitude: getEventLocationCoordinate(event, 'latitude'),
  longitude: getEventLocationCoordinate(event, 'longitude'),
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
});

export class EventDetailsScreen extends React.Component {
  static propTypes = {
    event: React.PropTypes.object.isRequired,
    openURL: React.PropTypes.func.isRequired,
    navigateTo: React.PropTypes.func.isRequired,
    navigationBarStyle: React.PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.addToCalendar = this.addToCalendar.bind(this);
    this.openMapScreen = this.openMapScreen.bind(this);
    this.renderRsvpButton = this.renderRsvpButton.bind(this);
    this.openURL = this.openURL.bind(this);
  }

  isNavigationBarClear() {
    const { navigationBarStyle } = this.props;
    return navigationBarStyle === 'clear';
  }

  resolveNavBarProps(options = {}) {
    const { event } = this.props;

    let styleName = '';
    let animationName = '';
    if (this.isNavigationBarClear()) {
      if (event.image) {
        // If navigation bar is clear and image exists, navigation bar should be initially clear
        // but after scrolling down navigation bar should appear (solidify animation)
        styleName = 'clear';
        animationName = 'solidify';
      } else {
        // If navigation bar is clear, but there is no image, navigation bar should be set to solid,
        // but boxing animation should be applied so title appears after scrolling down
        animationName = 'boxing';
      }
    }

    return {
      share: {
        title: event.name,
        link: event.rsvpLink,
      },
      styleName,
      animationName,
      title: event.name,
      ...options,
    };
  }

  addToCalendar() {
    addToCalendar(this.props.event);
  }

  openMapScreen() {
    const { event, navigateTo } = this.props;
    navigateTo({
      screen: ext('SingleEventMapScreen'),
      title: `Map View - ${event.name}`,
      props: {
        title: _.get(event, 'name'),
        marker: getEventLocation(event),
      },
    });
  }

  openURL() {
    const { event, openURL } = this.props;

    openURL(event.rsvpLink, event.name);
  }

  renderMap(event) {
    if (!isValidEvent(event)) {
      return null;
    }
    const location = getEventLocation(event);
    return (
      <TouchableOpacity onPress={this.openMapScreen}>
        <InlineMap
          initialRegion={location}
          markers={[location]}
          selectedMarker={location}
          styleName="medium-tall"
        >
          <View styleName="vertical fill-parent v-end h-center lg-gutter-bottom">
            <Subtitle>{_.get(event, 'location.formattedAddress')}</Subtitle>
          </View>
        </InlineMap>
      </TouchableOpacity>
    );
  }

  renderHeadlineDetails(event, darkened = true) {
    const textColorStyle = darkened ? '' : 'bright';

    return (
      <View virtual>
        <Title styleName={`${textColorStyle} md-gutter-bottom`}>
          {event.name.toUpperCase()}
        </Title>
        <Caption styleName={`${textColorStyle} sm-gutter-bottom`}>
          {formatDate(event.startTime)}
        </Caption>
        <Divider styleName="line small center" />
        <Caption styleName={`${textColorStyle} md-gutter-bottom`}>
          {formatDate(event.endTime)}
        </Caption>
      </View>
    );
  }

  renderAddToCalendarButton(darkened = true) {
    return (
      <Button
        onPress={this.addToCalendar}
        styleName={`${darkened ? 'secondary' : ''} md-gutter-top`}
      >
        <Icon name="add-event" />
        <Text>ADD TO CALENDAR</Text>
      </Button>
    );
  }

  renderRsvpButton(event) {
    return event.rsvpLink ? (
      <TouchableOpacity onPress={this.openURL}>
        <Divider styleName="line" />
        <Row styleName="small">
          <Icon name="add-event" />
          <Text>RSVP</Text>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
      </TouchableOpacity>
    ) : null;
  }

  renderInformation(event) {
    return event.description ? (
      <View styleName="solid">
        <Divider styleName="section-header">
          <Caption>INFORMATION</Caption>
        </Divider>
        <Html body={event.description} />
      </View>
    ) : null;
  }

  renderData(event) {
    return (
      <ScrollView>
        {this.renderHeader(event)}
        {this.renderRsvpButton(event)}
        {this.renderInformation(event)}
        {this.renderMap(event)}
      </ScrollView>
    );
  }

  renderScreen() {
    const { event } = this.props;
    let screenStyle = '';
    if (this.isNavigationBarClear()) {
      if (event.image) {
        screenStyle = 'full-screen';
      }
    }

    const screenStyleName = `${screenStyle} paper`;

    return (
      <Screen styleName={screenStyleName}>
        <NavigationBar {...this.resolveNavBarProps()} />
        {this.renderData(event)}
      </Screen>
    );
  }

  render() {
    return this.renderScreen();
  }
}

export const mapDispatchToProps = {
  openURL: openUrlAction,
  navigateTo: navigateToAction,
};

export default connect(undefined, mapDispatchToProps)(
  connectStyle(ext('EventDetailsScreen'))(EventDetailsScreen),
);
