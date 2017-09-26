import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  View,
  Image,
  Card,
} from '@shoutem/ui';

import {
  ArticleView,
} from './ArticleView';

export class MediumListArticleView extends ArticleView {
  render() {
    const { title, imageUrl, date } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption>{momentDate.fromNow()}</Caption>
    ) : null;

    return (
      <TouchableOpacity
        onPress={this.onPress}
      >
        <Card styleName="horizontal">
          <Image
            styleName="medium-portrait rounded-corners placeholder"
            source={{ uri: imageUrl }}
          />
          <View styleName="content pull-left space-between rounded-corners">
            <Subtitle numberOfLines={3}>{title}</Subtitle>
            <View styleName="horizontal stretch space-between v-center">
              {dateInfo}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
   );
  }
}
