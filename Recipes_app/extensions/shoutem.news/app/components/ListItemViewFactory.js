import React from 'react';
import _ from 'lodash';

import { ListArticleView } from './ListArticleView';
import { MediumListArticleView } from './MediumListArticleView';
import { LargeListArticleView } from './LargeListArticleView';
import { TileListArticleView } from './TileListArticleView';

const layoutItems = {
  'compact-list': ListArticleView,
  'medium-list': MediumListArticleView,
  'large-list': LargeListArticleView,
  'tile-list': TileListArticleView,
};

export const getItemProps = item => ({
  key: item.id,
  articleId: item.id,
  title: item.title,
  imageUrl: _.get(item, 'image.url'),
  author: item.newsAuthor,
  date: item.timeUpdated,
});

/**
 * Creates a specific list item for a given layout with data about an article.
 *
 * @param {string} layoutName A name of the layout
 * @param {*} article Object that contains data about an article
 * @param {function} onPress A function that is called after a click on the item
 * @returns List item component
 */
export const createListItem = (layoutName, article, onPress) => {
  if (!layoutItems[layoutName]) {
    console.error(`List item not registered for layout ${layoutName}`);
    return null;
  }

  const ListItem = layoutItems[layoutName];
  return (<ListItem {...getItemProps(article)} onPress={onPress} />);
};
