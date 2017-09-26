import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { navigateTo as navigateToAction } from '@shoutem/core/navigation';
import { find, next } from '@shoutem/redux-io';

import { ListScreen } from 'shoutem.application';
import { ListArticleView } from 'shoutem.news';

import { ext } from '../const';
import {
  WORDPRESS_NEWS_SCHEMA,
  fetchWordpressPosts,
  getFeedItems,
} from '../redux';
import { getLeadImageUrl } from '../services';

export class ArticlesListScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
    page: React.PropTypes.number,
    perPage: React.PropTypes.number,
    loadFeed: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      schema: WORDPRESS_NEWS_SCHEMA,
      page: 1,
      nextPage: null,
      perPage: 20,
    };

    this.openArticle = this.openArticle.bind(this);
    this.openArticleWithId = this.openArticleWithId.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  fetchData() {
    const { feedUrl, shortcut } = this.props;
    const { perPage } = this.state;

    if (_.isEmpty(feedUrl)) {
      return;
    }

    this.setState({ page: 1 });
    this.props.fetchWordpressPosts({
      feedUrl,
      shortcutId: shortcut.id,
      page: 1,
      perPage,
    });
  }

  loadMore() {
    this.props.next(this.props.data);
  }

  openArticle(article) {
    const nextArticle = this.getNextArticle(article);
    const route = {
      screen: ext('ArticleDetailsScreen'),
      title: article.title.rendered,
      props: {
        article,
        nextArticle,
        openArticle: this.openArticle,
      },
    };

    this.props.navigateToAction(route);
  }

  openArticleWithId(articleId) {
    const { data } = this.props;
    const article = _.find(data, _.matchesProperty('id', parseInt(articleId, 10)));
    this.openArticle(article);
  }

  getNextArticle(article) {
    const { data } = this.props;
    const currentArticleIndex = _.findIndex(data, { id: article.id });
    if (currentArticleIndex < 0) return null;
    return data[currentArticleIndex + 1];
  }

  renderRow(article) {
    return (
      <ListArticleView
        key={article.id}
        articleId={article.id.toString()}
        title={article.title.rendered}
        imageUrl={getLeadImageUrl(article)}
        date={article.date}
        onPress={this.openArticleWithId}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');
  const { shortcut } = ownProps;

  return {
    feedUrl,
    shortcut,
    data: getFeedItems(state, feedUrl),
  };
};

export const mapDispatchToProps = {
  navigateToAction,
  fetchWordpressPosts,
  find,
  next,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesListScreen'))(ArticlesListScreen),
);
