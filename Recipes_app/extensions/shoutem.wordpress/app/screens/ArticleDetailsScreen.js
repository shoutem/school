import React from 'react';
import { Dimensions } from 'react-native';
import * as _ from 'lodash';
import moment from 'moment';

import { connectStyle } from '@shoutem/theme';
import {
  Screen,
  ScrollView,
  View,
  Tile,
  Title,
  Caption,
  Icon,
  Image,
  ImageGallery,
} from '@shoutem/ui';
import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import {
  RichMedia,
} from '@shoutem/ui-addons';
import { NextArticle } from 'shoutem.news';

import { ext } from '../const';
import { getLeadImageUrl } from '../services';

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
    // Whether the inline gallery should be displayed on the
    // details screen. Inline gallery displays the image
    // attachments that are not directly referenced in the
    // article body.
    showInlineGallery: React.PropTypes.bool,
    openNextArticle: React.PropTypes.func,
  };

  renderUpNext() {
    const { nextArticle, openArticle } = this.props;
    if (nextArticle && openArticle) {
      return (
        <NextArticle
          title={nextArticle.title.rendered}
          imageUrl={getLeadImageUrl(nextArticle)}
          openArticle={() => openArticle(nextArticle)}
        />
      );
    }

    return null;
  }

  renderInlineGallery() {
    const { article, showInlineGallery } = this.props;
    if (!showInlineGallery) {
      return null;
    }
    const images = _.map(article.wp.attachments.href, 'url');
    return (
      <ImageGallery sources={images} height={300} width={Dimensions.get('window').width} />
    );
  }

  render() {
    const { article } = this.props;
    const articleImageUrl = getLeadImageUrl(article);
    const momentDate = moment(article.modified);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption styleName="md-gutter-left">
        {momentDate.fromNow()}
      </Caption>
    ) : null;

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar
          styleName="clear"
          animationName="solidify"
          title={article.title.rendered}
          share={{
            title: article.title.rendered,
            link: article.guid.link,
          }}
        />
        <ScrollView>
          <Image
            styleName="large-portrait placeholder"
            source={articleImageUrl ? { uri: articleImageUrl } : undefined}
            animationName="hero"
          >
            <Tile animationName="hero">
              <Title styleName="centered">{article.title.rendered.toUpperCase()}</Title>
              <View styleName="horizontal collapsed" virtual>
                <Caption numberOfLines={1} styleName="collapsible">{article.author}</Caption>
                {dateInfo}
              </View>
              <Icon name="down-arrow" styleName="scroll-indicator" />
            </Tile>
          </Image>
          <View styleName="solid">
            <RichMedia
              body={article.content.rendered}
            />
            {this.renderInlineGallery()}
            {this.renderUpNext()}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export default connectStyle(ext('ArticleDetailsScreen'))(ArticleDetailsScreen);
