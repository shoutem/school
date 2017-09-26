import React from 'react';
import { connectStyle } from '@shoutem/theme';
import {
  ScrollView,
  Screen,
  Title,
  Caption,
  Image,
  Tile,
  Html,
  View,
} from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import * as _ from 'lodash';
import moment from 'moment';

import { ext } from '../const';
import { NextArticle } from '../components/NextArticle';

export class ArticleDetailsScreen extends React.PureComponent {
  static propTypes = {
    // The news article to display
    article: React.PropTypes.object.isRequired,
    // The next article, if this article is defined, the
    // up next view will be displayed on this screen
    nextArticle: React.PropTypes.object,
    // A function that will open the given article, this
    // function is required to show the up next view
    openArticle: React.PropTypes.func,
  };

  renderUpNext() {
    const { nextArticle, openArticle } = this.props;
    if (nextArticle && openArticle) {
      return (
        <NextArticle
          title={nextArticle.title}
          imageUrl={_.get(nextArticle, 'image.url')}
          openArticle={() => openArticle(nextArticle)}
        />
      );
    }
    return null;
  }

  isNavigationBarClear() {
    const { navigationBarStyle } = this.props;
    return navigationBarStyle === 'clear';
  }

  renderImage() {
    const { article } = this.props;

    if (article.image) {
      return (
        <Image
          styleName="large"
          source={{ uri: _.get(article, 'image.url') }}
          animationName="hero"
        />
      );
    }
    return null;
  }

  renderHeader() {
    const { article } = this.props;

    return (
      <Tile styleName="text-centric md-gutter-bottom">
        <Title>{article.title.toUpperCase()}</Title>
        <View styleName="horizontal md-gutter-top">
          <Caption numberOfLines={1}>{article.newsAuthor}</Caption>
          <Caption styleName="md-gutter-left">
            {moment(article.timeUpdated).fromNow()}
          </Caption>
        </View>
      </Tile>
    );
  }

  render() {
    const { article } = this.props;

    let styleName = '';
    let animationName = '';
    let screenStyle = 'paper';
    if (this.isNavigationBarClear()) {
      if (article.image) {
        // If navigation bar is clear and image exists, navigation bar should be initially clear
        // but after scrolling down navigation bar should appear (solidify animation)
        styleName = 'clear';
        screenStyle += ' full-screen';
        animationName = 'solidify';
      } else {
        // If navigation bar is clear, but there is no image, navigation bar should be set to solid,
        // but boxing animation should be applied so title appears after scrolling down
        animationName = 'boxing';
      }
    }

    return (
      <Screen styleName={screenStyle}>
        <NavigationBar
          styleName={styleName}
          animationName={animationName}
          title={article.title}
          share={{
            link: article.link,
            title: article.title,
          }}
        />
        <ScrollView>
          {this.renderImage()}
          <View styleName="solid">
            {this.renderHeader()}
            <View styleName="sm-gutter-horizontal md-gutter-vertical">
              <Html body={article.body} />
            </View>
            {this.renderUpNext()}
          </View>

        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(ArticleDetailsScreen);
