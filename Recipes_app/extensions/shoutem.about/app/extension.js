// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';

// screens imports
import AboutScreen from './screens/AboutScreen';
import MapScreen from './screens/MapScreen';

// themes imports


export const screens = {
  MapScreen,
  AboutScreen
};

export const themes = {

};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
