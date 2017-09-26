import rio from '@shoutem/redux-io';
import { getAppId } from 'shoutem.application';
import { buildFeedUrl } from 'shoutem.rss';

import reducer, { RSS_PHOTOS_SCHEMA } from './reducers/';
import PhotosGrid from './screens/PhotosGrid';
import PhotosList from './screens/PhotosList';
import PhotoDetails from './screens/PhotoDetails';

export const screens = {
  PhotosGrid,
  PhotosList,
  PhotoDetails,
};

export { reducer };

export function appDidMount(app) {
  const state = app.getState();

  // Configure the RSS schema in RIO
  rio.registerSchema({
    schema: RSS_PHOTOS_SCHEMA,
    request: {
      endpoint: buildFeedUrl(state, RSS_PHOTOS_SCHEMA),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}
