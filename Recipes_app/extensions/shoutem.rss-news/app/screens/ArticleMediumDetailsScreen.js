import React from 'react';
import moment from 'moment';

import { connectStyle } from '@shoutem/theme';
import {
  ScrollView,
  Screen,
  Title,
  Caption,
  Image,
  Tile,
  View,
  Html,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { getLeadImageUrl, createRenderAttachment } from 'shoutem.rss';

import { ArticleDetailsScreen } from './ArticleDetailsScreen';
import { ext } from '../const';

class ArticleMediumDetailsScreen extends ArticleDetailsScreen {
  static propTypes = {
    ...ArticleDetailsScreen.propTypes,
  };

  getNavBarProps() {
    const { article } = this.props;
    return {
      styleName: getLeadImageUrl(article) ? 'clear' : 'no-border',
      animationName: getLeadImageUrl(article) ? 'solidify' : '',
      share: {
        title: article.title,
        link: article.link,
      },
    };
  }

  renderImage(imageUrl) {
    return imageUrl ? (
      <Image
        animationName="hero"
        styleName="large"
        source={{ uri: imageUrl }}
      />
    ) : null;
  }

  render() {
    const { article } = this.props;
    const imageUrl = getLeadImageUrl(article);
    const screenStyle = imageUrl ? 'full-screen paper' : 'paper';

    const momentDate = moment(article.timeUpdated);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">{momentDate.fromNow()}</Caption>
    ) : null;

    return (
      <Screen styleName={screenStyle}>
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderImage(imageUrl)}
          <View styleName="solid">
            <Tile styleName="text-centric md-gutter-bottom xl-gutter-bottom">
              <Title>{article.title.toUpperCase()}</Title>

              <View styleName="horizontal md-gutter-top">
                <Caption numberOfLines={1}>{article.newsAuthor}</Caption>
                {dateInfo}
              </View>
            </Tile>
            <Html body={article.body} renderElement={createRenderAttachment(article, 'image')} />
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('ArticleMediumDetailsScreen'))(ArticleMediumDetailsScreen);
