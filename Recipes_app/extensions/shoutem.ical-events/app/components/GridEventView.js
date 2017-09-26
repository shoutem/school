import React from 'react';
import {
  TouchableOpacity,
  Button,
  Subtitle,
  Caption,
  Card,
  View,
  Icon,
  Image
} from '@shoutem/ui';
import { formatDate } from '../services/Calendar';
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
          <Image styleName="placeholder medium-wide" source={{ uri: this.props.imageUrl }} />
          <View styleName="content">
            <Subtitle numberOfLines={3}>{event.name}</Subtitle>
            <View styleName="flexible horizontal v-end space-between">
              <Caption styleName="collapsible">
                {formatDate(event.start)}
              </Caption>
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
