import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { navigateTo } from '@shoutem/core/navigation';
import { CmsListScreen } from 'shoutem.cms';

import { ext } from '../const';
import { createListItem, getItemProps } from '../components/ListItemViewFactory';
import { FeaturedArticleView } from '../components/FeaturedArticleView';

export class ArticlesScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: React.PropTypes.func.isRequired,
    listType: React.PropTypes.string.isRequired,
    hasFeaturedItem: React.PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.openArticle = this.openArticle.bind(this);
    this.openArticleWithId = this.openArticleWithId.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      ...this.state,
      schema: ext('articles'),
    };
  }

  getNavBarProps() {
    const { hasFeaturedItem } = this.props;
    const styleName = hasFeaturedItem ? 'featured' : '';

    return { ...super.getNavBarProps(), styleName };
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

  renderRow(data, sectionId, index) {
    const { listType, hasFeaturedItem } = this.props;
    const isFeaturedItem = hasFeaturedItem && index === '0';

    if (isFeaturedItem) {
      return (
        <FeaturedArticleView {...getItemProps(data)} onPress={this.openArticleWithId} />
      );
    }

    return createListItem(listType, data, this.openArticleWithId);
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].latestNews,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesScreen'))(ArticlesScreen),
);
