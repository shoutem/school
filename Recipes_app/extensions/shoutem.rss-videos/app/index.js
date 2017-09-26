import rio from '@shoutem/redux-io';
import { buildFeedUrl } from 'shoutem.rss';

import VideosList from './screens/VideosList';
import VideosSmallList from './screens/SmallVideosList';
import VideoDetails from './screens/VideoDetails';
import reducer, { RSS_VIDEOS_SCHEMA } from './redux';

export const screens = {
  VideosList,
  VideosSmallList,
  VideoDetails,
};

export { reducer };

export function appDidMount(app) {
  const state = app.getState();

  // Configure the RSS schema in RIO
  rio.registerSchema({
    schema: RSS_VIDEOS_SCHEMA,
    request: {
      endpoint: buildFeedUrl(state, RSS_VIDEOS_SCHEMA),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}
