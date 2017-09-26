import * as extension from './extension.js';
import reducer from './redux';

const {
  GridEventsScreen,
  EventsScreen,
  MediumEventDetailsScreen,
  LargeEventDetailsScreen } = extension.screens;

export const screens = {
  ...extension.screens,
  EventsScreen: GridEventsScreen,
  FixedGridEventsScreen: GridEventsScreen,
  CompactListEventsScreen: EventsScreen,
  FeaturedCompactListEventsScreen: EventsScreen,
  LargeListEventsScreen: EventsScreen,
  MediumListEventsScreen: EventsScreen,
  FeaturedMediumListEventsScreen: EventsScreen,
  TileListEventsScreen: EventsScreen,
  EventDetailsScreen: LargeEventDetailsScreen,
  SolidNavbarMediumEventDetailsScreen: MediumEventDetailsScreen,
  SolidNavbarLargeEventDetailsScreen: LargeEventDetailsScreen,
  ClearNavbarMediumEventDetailsScreen: MediumEventDetailsScreen,
};

export {
  reducer,
};
