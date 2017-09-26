// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';
import VimeoList from './screens/VimeoList';
import SmallVimeoList from './screens/SmallVimeoList';
import VimeoDetails from './screens/VimeoDetails';

export const screens = {
  VimeoList,
  SmallVimeoList,
  VimeoDetails,
};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
