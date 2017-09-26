import React from 'react';

import ListEventView from './ListEventView';
import MediumEventView from './MediumEventView';
import LargeEventView from './LargeEventView';
import TileEventView from './TileEventView';

const layoutItems = {
  'compact-list': ListEventView,
  'medium-list': MediumEventView,
  'large-list': LargeEventView,
  'tile-list': TileEventView,
};

/**
 * Creates a specific list item for a given layout with data about an event.
 *
 * @param {*} layoutName A name of the layout
 * @param {*} event Object that contains data about the event
 * @param {*} onPress A function that is called after a click on the item
 * @param {*} action A function that is called after a click on the add to calendar button
 * @param {*} style Object that contains style for the item
 * @returns List item component
 */
export const createListItem = (layoutName, event, onPress, action, style) => {
  if (!layoutItems[layoutName]) {
    console.error(`List item not registered for layout ${layoutName}`);
    return null;
  }

  const ListItem = layoutItems[layoutName];
  return (<ListItem event={event} onPress={onPress} action={action} style={style} />);
};
