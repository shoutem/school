import React from 'react';
import {
  TouchableOpacity,
  Button,
  Subtitle,
  Caption,
  Card,
  View,
  Icon,
} from '@shoutem/ui';
import { formatDate } from '../shared/Calendar';
import EventImage from './EventImage';
import { BaseEventItem } from './BaseEventItem';

/**
 * A component used to render a single grid event item
 */
export default class extends BaseEventItem {
  render() {
    const { event } = this.props;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="flexible">
          <EventImage styleName="medium-wide" event={event} />
          <View styleName="content space-between">
            <Subtitle numberOfLines={3}>{event.name}</Subtitle>
            <View styleName="horizontal space-between v-center">
              <Caption styleName="collapsible">{formatDate(event.startTime)}</Caption>
              <Button styleName="tight clear" onPress={this.action}>
                <Icon name="add-event" />
              </Button>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}
