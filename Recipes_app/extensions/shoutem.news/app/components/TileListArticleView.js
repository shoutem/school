import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Caption,
  Image,
  Tile,
  Title,
  Divider,
} from '@shoutem/ui';

import {
  ArticleView,
} from './ArticleView';

export class TileListArticleView extends ArticleView {
  render() {
    const { title, imageUrl, date } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption>{momentDate.fromNow()}</Caption>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Image styleName="large-banner placeholder" source={{ uri: imageUrl }}>
          <Tile>
            <Title numberOfLines={3}>{title.toUpperCase()}</Title>
            {dateInfo}
          </Tile>
        </Image>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
