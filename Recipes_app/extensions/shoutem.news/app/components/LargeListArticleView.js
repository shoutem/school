import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Title,
  Caption,
  View,
  Image,
  Row,
} from '@shoutem/ui';

import {
  ArticleView,
} from './ArticleView';

export class LargeListArticleView extends ArticleView {
  render() {
    const { title, imageUrl, date } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption>{momentDate.fromNow()}</Caption>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <View styleName="md-gutter-bottom">
          <Image
            styleName="large-wide placeholder"
            source={{ uri: imageUrl }}
          />
          <Row>
            <View styleName="vertical stretch space-between">
              <Title numberOfLines={2}>{title}</Title>
              {dateInfo}
            </View>
          </Row>
        </View>
      </TouchableOpacity>
    );
  }
}
