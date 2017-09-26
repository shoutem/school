import ArticlesGridScreen from './screens/ArticlesGridScreen';
import ArticlesFeaturedListScreen from './screens/ArticlesFeaturedListScreen';
import ArticlesListScreen from './screens/ArticlesListScreen';
import ArticleDetailsScreen from './screens/ArticleDetailsScreen';
import ArticleMediumDetailsScreen from './screens/ArticleMediumDetailsScreen';
import reducer from './redux';

const screens = {
  ArticlesListScreen,
  ArticlesFeaturedListScreen,
  ArticlesGridScreen,
  ArticleDetailsScreen,
  ArticleMediumDetailsScreen,
};

export { appDidMount } from './app';

export {
  reducer,
  screens,
};
