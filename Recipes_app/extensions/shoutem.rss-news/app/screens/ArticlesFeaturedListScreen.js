import React from 'react';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';

import { getLeadImageUrl } from 'shoutem.rss';
import { FeaturedArticleView, ListArticleView } from 'shoutem.news';

import {
  ArticlesListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './ArticlesListScreen';
import { ext } from '../const.js';

export class ArticlesFeaturedListScreen extends ArticlesListScreen {
  static propTypes = {
    ...ArticlesListScreen.propTypes,
    onPress: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(article, sectionId, index) {
    if (index === '0') {
      return (
        <FeaturedArticleView
          key={article.id}
          articleId={article.id}
          title={article.title}
          imageUrl={getLeadImageUrl(article)}
          author={article.author}
          date={article.timeUpdated}
          onPress={this.openArticleWithId}
        />
      );
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(
connectStyle(ext('ArticlesFeaturedListScreen'), {})(ArticlesFeaturedListScreen),
);
