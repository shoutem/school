import rio from '@shoutem/redux-io';

import { buildFeedUrl } from 'shoutem.rss';

import { RSS_NEWS_SCHEMA } from './redux';

export function appDidMount(app) {
  const state = app.getState();

  // Configure the RSS news schema in RIO
  rio.registerSchema({
    schema: RSS_NEWS_SCHEMA,
    request: {
      endpoint: buildFeedUrl(state, RSS_NEWS_SCHEMA),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}
