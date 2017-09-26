import rio from '@shoutem/redux-io';

import { API_ENDPOINT } from './const';
import { WORDPRESS_NEWS_SCHEMA, WORDPRESS_MEDIA_SCHEMA } from './redux';

export function appDidMount() {
  rio.registerSchema({
    schema: WORDPRESS_NEWS_SCHEMA,
    request: {
      endpoint: API_ENDPOINT,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  });

  rio.registerSchema({
    schema: WORDPRESS_MEDIA_SCHEMA,
    request: {
      endpoint: API_ENDPOINT,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  });
}
