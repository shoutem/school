import React from 'react';
import {
  TouchableOpacity,
  Title,
  Caption,
  View,
  Tile,
  Button,
  Text,
  Icon,
  Divider,
  Image
} from '@shoutem/ui';
import { BaseEventItem } from './BaseEventItem';
import { formatDate } from '../services/Calendar';

/**
 * A component used to render events
 */
export default class FeaturedEventView extends BaseEventItem {
  render() {
    const { event, styleName } = this.props;

    const containerStyleName = `sm-gutter featured ${styleName || ''}`;

    return (
      <TouchableOpacity key={event.id} onPress={this.onPress}>
        <View styleName={containerStyleName}>
          <Image styleName="placeholder featured" source={{ uri: this.props.imageUrl }}>
            <Tile>
              <Title styleName="md-gutter-bottom">
                {(event.name || '').toUpperCase()}
              </Title>
              <Caption>{formatDate(event.start)}</Caption>
              <Divider styleName="line small center" />
              <Caption styleName="md-gutter-bottom">{formatDate(event.end)}</Caption>
              <Button
                onPress={this.action}
                styleName="md-gutter-top"
              >
                <Icon name="add-event" />
                <Text>ADD TO CALENDAR</Text>
              </Button>
            </Tile>
          </Image>
        </View>
      </TouchableOpacity>
    );
  }
}
