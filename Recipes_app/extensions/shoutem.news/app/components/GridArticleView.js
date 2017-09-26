import React from 'react';
import moment from 'moment';

import {
  TouchableOpacity,
  Subtitle,
  Caption,
  Card,
  View,
  Image,
} from '@shoutem/ui';

import {
  ArticleView,
} from './ArticleView';

/**
 * A component used to render a single grid article item
 */
export class GridArticleView extends ArticleView {
  static propTypes = {
    onPress: React.PropTypes.func,
    articleId: React.PropTypes.string,
    title: React.PropTypes.string,
    imageUrl: React.PropTypes.string,
    date: React.PropTypes.string,
  };

  render() {
    const { title, imageUrl, date } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <View styleName="horizontal">
        <Caption>{momentDate.fromNow()}</Caption>
      </View>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Card styleName="flexible">
          <Image
            styleName="medium-wide placeholder"
            source={{ uri: imageUrl }}
          />
          <View styleName="flexible content space-between">
            <Subtitle numberOfLines={3} styleName="lg-gutter-bottom">{title}</Subtitle>
            {dateInfo}
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}
