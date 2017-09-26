import React from 'react';
import _ from 'lodash';
import {
  Image,
  View,
  Tile,
} from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { connect } from 'react-redux';
import { ext } from '../const';
import { EventDetailsScreen, mapDispatchToProps } from './EventDetailsScreen';

class MediumEventDetailsScreen extends EventDetailsScreen {
  renderWithoutPhoto(event) {
    return (
      <Tile styleName="text-centric xl-gutter-top">
        {this.renderHeadlineDetails(event)}
        {this.renderAddToCalendarButton()}
      </Tile>
    );
  }

  renderHeader(event) {
    if (!_.has(event, 'image.url')) {
      return this.renderWithoutPhoto(event);
    }

    return (
      <View>
        <Image
          styleName="large-wide placeholder"
          animationName="hero"
          source={{ uri: _.get(event, 'image.url') }}
        />
        <Tile styleName="text-centric inflexible">
          {this.renderHeadlineDetails(event)}
          {this.renderAddToCalendarButton()}
        </Tile>
      </View>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(
  connectStyle(ext('MediumEventDetailsScreen'))(MediumEventDetailsScreen),
);
