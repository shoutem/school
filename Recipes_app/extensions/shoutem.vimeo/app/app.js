import rio from '@shoutem/redux-io';
import { buildFeedUrl } from 'shoutem.rss';

import { VIMEO_SCHEMA } from './redux';

export function appDidMount(app) {
  const state = app.getState();

  rio.registerSchema({
    schema: VIMEO_SCHEMA,
    request: {
      endpoint: buildFeedUrl(state, VIMEO_SCHEMA),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}
