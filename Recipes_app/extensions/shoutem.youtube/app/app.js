import rio from '@shoutem/redux-io';
import { YOUTUBE_VIDEOS_SCHEMA } from './redux';
import { API_ENDPOINT } from './const';

export function appDidMount() {
  rio.registerSchema({
    schema: YOUTUBE_VIDEOS_SCHEMA,
    request: {
      endpoint: API_ENDPOINT,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
}
