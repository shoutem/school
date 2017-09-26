// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';
import YoutubeSmallListScreen from './screens/YoutubeSmallListScreen';
import YoutubeVideoDetailsScreen from './screens/YoutubeVideoDetailsScreen';
import YoutubeVideosScreen from './screens/YoutubeVideosScreen';

export const screens = {
  YoutubeSmallListScreen,
  YoutubeVideosScreen,
  YoutubeVideoDetailsScreen,
};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
