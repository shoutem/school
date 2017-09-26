import React from 'react';
import _ from 'lodash';

import {
  Image,
  View,
  Tile,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { connect } from 'react-redux';
import { ext } from '../extension';
import { BaseEventDetailsScreen } from './BaseEventDetailsScreen';
import { openURL as openUrlAction } from 'shoutem.web-view';
import { navigateTo as navigateToAction } from '@shoutem/core/navigation';

class DetailsScreenWithMediumPhoto extends BaseEventDetailsScreen {
  renderWithoutPhoto(event) {
    return (
      <Tile styleName="text-centric xl-gutter-top">
        {this.renderHeadlineDetails(event)}
        {this.renderAddToCalendarButton()}
      </Tile>
    );
  }

  renderHeader(event) {
    if (!event.imageUrl) {
      return this.renderWithoutPhoto(event);
    }

    return (
      <View>
        <Image
          styleName="large-wide placeholder"
          animationName="hero"
          source={{ uri: event.imageUrl }}
        />
        <Tile styleName="text-centric inflexible">
          {this.renderHeadlineDetails(event)}
          {this.renderAddToCalendarButton()}
        </Tile>
      </View>
    );
  }

  resolveNavBarProps(options = {}) {
    const { event } = this.props;

    return {
      share: {
        title: event.name,
        link: event.rsvpLink,
      },
      styleName: _.has(event, 'image.url') ? 'clear' : 'no-border',
      animationName: _.has(event, 'image.url') ? 'solidify' : 'boxing',
      title: event.name,
      ...options,
    };
  }

  renderScreen() {
    const { event } = this.props;

    if (!_.has(event, 'image.url')) {
      // Do not render in full screen, this layout have NavBar
      return super.renderScreen(false);
    }

    return super.renderScreen(true);
  }
}

export const mapDispatchToProps = {
  openURL: openUrlAction,
  navigateTo: navigateToAction,
};

export default connect(undefined, mapDispatchToProps)(
  connectStyle(ext('DetailsScreenWithMediumPhoto'))(DetailsScreenWithMediumPhoto),
);
