import reducer from './reducer';
import * as extension from './extension.js';
import ArticlesScreen from './screens/ArticlesScreen';
import GridArticlesScreen from './screens/GridArticlesScreen';
import ArticleDetailsScreen from './screens/ArticleDetailsScreen';
import LargeArticleDetailsScreen from './screens/LargeArticleDetailsScreen';

export { FeaturedArticleView } from './components/FeaturedArticleView';
export { GridArticleView } from './components/GridArticleView';
export { ListArticleView } from './components/ListArticleView';
export { NextArticle } from './components/NextArticle';

export const screens = {
  ...extension.screens,
  ArticlesScreen: GridArticlesScreen,
  FixedGridArticlesScreen: GridArticlesScreen,
  CompactListArticlesScreen: ArticlesScreen,
  FeaturedCompactListArticlesScreen: ArticlesScreen,
  LargeListArticlesScreen: ArticlesScreen,
  MediumListArticlesScreen: ArticlesScreen,
  FeaturedMediumListArticlesScreen: ArticlesScreen,
  TileListArticlesScreen: ArticlesScreen,
  ArticleDetailsScreen: LargeArticleDetailsScreen,
  SolidNavbarMediumArticleDetailsScreen: ArticleDetailsScreen,
  SolidNavbarLargeArticleDetailsScreen: LargeArticleDetailsScreen,
  ClearNavbarMediumArticleDetailsScreen: ArticleDetailsScreen,
};

export const themes = extension.themes;

export { reducer };
