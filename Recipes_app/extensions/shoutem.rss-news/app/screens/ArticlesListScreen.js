import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { navigateTo as navigateToAction } from '@shoutem/core/navigation';
import { find, next } from '@shoutem/redux-io';

import { RssListScreen, getLeadImageUrl } from 'shoutem.rss';
import { ListArticleView } from 'shoutem.news';

import { ext } from '../const.js';
import { RSS_NEWS_SCHEMA, getNewsFeed } from '../redux';

export class ArticlesListScreen extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
      schema: RSS_NEWS_SCHEMA,
    };

    this.openArticle = this.openArticle.bind(this);
    this.openArticleWithId = this.openArticleWithId.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  openArticle(article) {
    const { navigateTo } = this.props;
    const nextArticle = this.getNextArticle(article);

    const route = {
      screen: ext('ArticleDetailsScreen'),
      title: article.title,
      props: {
        article,
        nextArticle,
        openArticle: this.openArticle,
      },
    };

    navigateTo(route);
  }

  openArticleWithId(id) {
    const { data } = this.props;
    const article = _.find(data, { id });
    this.openArticle(article);
  }

  getNextArticle(article) {
    const { data } = this.props;
    const currentArticleIndex = _.findIndex(data, { id: article.id });
    return data[currentArticleIndex + 1];
  }

  renderRow(article) {
    return (
      <ListArticleView
        key={article.id}
        articleId={article.id}
        title={article.title}
        imageUrl={getLeadImageUrl(article)}
        date={article.timeUpdated}
        onPress={this.openArticleWithId}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  return {
    feedUrl,
    data: getNewsFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = { navigateTo: navigateToAction, find, next };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesListScreen'))(ArticlesListScreen),
);
