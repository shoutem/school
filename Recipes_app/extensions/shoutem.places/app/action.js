import { navigateTo } from '@shoutem/core/navigation';
import { ext } from './const';

// Define your actions here


// Shoutem specified actions
export function openPlacesList(shortcut) {
  return navigateTo({
    screen: ext('IconPlacesList'),
  });
}
