import { combineReducers } from 'redux';
import { one, update } from '@shoutem/redux-io';
import { url, appId } from 'environment';

export const SHORTCUTS = 'shoutem.core.shortcuts';

export default combineReducers({
  shortcut: one(SHORTCUTS, 'shortcut'),
});

export function updateShortcut(shortcut) {
  const config = {
    schema: SHORTCUTS,
    request: {
      endpoint: `//${url.apps}/v1/apps/${appId}/shortcuts/${shortcut.id}`,
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return update(config, {
    type: SHORTCUTS,
    ...shortcut,
  });
}
