// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';

// screens imports


// themes imports


export const screens = {

};

export const themes = {

};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
