import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { cloneStatus } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

import { ArticlesScreen, mapStateToProps, mapDispatchToProps } from './ArticlesScreen';
import { GridArticleView } from '../components/GridArticleView';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import { getItemProps } from '../components/ListItemViewFactory';

import {
  GridRow,
} from '@shoutem/ui';

const GRID_ITEMS_PER_ROW = 2;

export class GridArticlesScreen extends ArticlesScreen {
  renderRow(data, sectionId, index) {
    const { hasFeaturedItem } = this.props;
    const isFeaturedItem = hasFeaturedItem && index === '0';

    if (isFeaturedItem) {
      return (
        <FeaturedArticleView {...getItemProps(data[0])} onPress={this.openArticleWithId} />
      );
    }

    const articleViews = _.map(data, (article) => {
      return (
        <GridArticleView {...getItemProps(article)} onPress={this.openArticleWithId} />
      );
    });

    return (
      <GridRow columns={2}>
        {articleViews}
      </GridRow>
    );
  }

  renderData(articles) {
    const { hasFeaturedItem } = this.props;

    // Group the articles into rows with 2 columns
    // If the screen has a featured article, it is the first article
    let isFeaturedArticle = hasFeaturedItem;
    const groupedArticles = GridRow.groupByRows(articles, GRID_ITEMS_PER_ROW, () => {
      if (isFeaturedArticle) {
        // The first article is featured, and it
        // should take up the entire width of the grid
        isFeaturedArticle = false;
        return GRID_ITEMS_PER_ROW;
      }
      return 1;
    });

    // Transfer the loading status from the original collection
    cloneStatus(articles, groupedArticles);

    return super.renderData(groupedArticles);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('ArticlesScreen'))(GridArticlesScreen),
);

