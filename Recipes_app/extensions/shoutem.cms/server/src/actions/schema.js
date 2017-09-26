import { find } from '@shoutem/redux-io';
import { url, appId } from 'environment';
import { ext } from 'context';
import { SCHEMAS, CURRENT_SCHEMA } from '../types';

export function loadSchema(schema = CURRENT_SCHEMA) {
  const config = {
    schema: SCHEMAS,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/schemas/${schema}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('schema'));
}
