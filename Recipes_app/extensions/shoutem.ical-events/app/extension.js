// This file is managed by Shoutem CLI
// You should not change it
import pack from './package.json';

// screens imports
import EventsScreen from './screens/EventsScreen';
import EventsListScreen from './screens/EventsListScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import EventDetailsScreenWithMediumPhoto from './screens/EventDetailsScreenWithMediumPhoto';
import EventMapScreen from './screens/EventMapScreen';

// themes imports


export const screens = {
  EventsScreen,
  EventsListScreen,
  EventDetailsScreen,
  EventDetailsScreenWithMediumPhoto,
  EventMapScreen
};

export const themes = {

};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
