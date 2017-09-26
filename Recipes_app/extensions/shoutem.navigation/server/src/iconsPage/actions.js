import { combineReducers } from 'redux';
import { collection, find } from '@shoutem/redux-io';
import { url, appId } from 'environment';
import { ext } from 'context';

export const SHORTCUTS = 'shoutem.core.shortcuts';

export default combineReducers({
  shortcuts: collection(SHORTCUTS, ext('shortcuts')),
});

export function loadShortcuts() {
  const config = {
    schema: SHORTCUTS,
    request: {
      endpoint: `//${url.apps}/v1/apps/${appId}/shortcuts`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('shortcuts'));
}
