// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';

// screens imports
import ArticlesScreen from './screens/ArticlesScreen';
import GridArticlesScreen from './screens/GridArticlesScreen';
import ArticleDetailsScreen from './screens/ArticleDetailsScreen';
import LargeArticleDetailsScreen from './screens/LargeArticleDetailsScreen';

// themes imports


export const screens = {
  ArticlesScreen,
  GridArticlesScreen,
  ArticleDetailsScreen,
  LargeArticleDetailsScreen,
};

export const themes = {

};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
