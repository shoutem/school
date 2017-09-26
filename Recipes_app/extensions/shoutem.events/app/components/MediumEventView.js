import React from 'react';
import _ from 'lodash';

import {
  Subtitle,
  Caption,
  View,
  Icon,
  TouchableOpacity,
  Button,
  Card,
} from '@shoutem/ui';

import { formatDate } from '../shared/Calendar';
import EventImage from './EventImage';
import { BaseEventItem } from './BaseEventItem';

/**
 * Component used to render single list event item
 */
export default class MediumEventView extends BaseEventItem {

  render() {
    const { event } = this.props;
    return (
      <TouchableOpacity
        disabled={!_.isFunction(this.props.onPress)}
        onPress={this.onPress}
        key={event.id}
      >
        <Card styleName="horizontal">
          <EventImage styleName="medium-portrait rounded-corners" event={event} />
          <View styleName="content pull-left space-between rounded-corners">
            <Subtitle numberOfLines={3} >{event.name}</Subtitle>
            <View styleName="horizontal stretch space-between v-center">
              <Caption>
                {formatDate(event.startTime)}
              </Caption>
              <Button
                styleName="tight clear"
                onPress={this.action}
              >
                <Icon name="add-event" />
              </Button>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}
