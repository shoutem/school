import React from 'react';
import { connectStyle } from '@shoutem/theme';
import {
  Title,
  Caption,
  Icon,
  Image,
  Tile,
  View,
} from '@shoutem/ui';

import * as _ from 'lodash';
import moment from 'moment';

import { ext } from '../const';
import { ArticleDetailsScreen } from './ArticleDetailsScreen';

export class LargeArticleDetailsScreen extends ArticleDetailsScreen {
  renderImage() {
    const { article } = this.props;

    return (
      <Image
        styleName="large-portrait placeholder"
        source={{ uri: _.get(article, 'image.url') }}
        animationName="hero"
      >
        <Tile animationName="hero">
          <Title styleName="centered">{article.title.toUpperCase()}</Title>
            {/* Virtual prop makes View pass Tile color style to Caption */}
          <View styleName="horizontal md-gutter-top" virtual>
            <Caption styleName="collapsible" numberOfLines={1}>{article.newsAuthor}</Caption>
            <Caption styleName="md-gutter-left">
              {moment(article.timeUpdated).fromNow()}
            </Caption>
          </View>
        </Tile>
        <Icon name="down-arrow" styleName="scroll-indicator" />
      </Image>
    );
  }

  renderHeader() {
    return null;
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(LargeArticleDetailsScreen);
