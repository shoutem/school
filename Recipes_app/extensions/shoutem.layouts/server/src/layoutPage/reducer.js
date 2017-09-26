import { combineReducers } from 'redux';
import { one, find, update } from '@shoutem/redux-io';
import { url, appId } from 'environment';
import { ext } from 'context';

export const SHORTCUTS = 'shoutem.core.shortcuts';
export const SCREENS = 'shoutem.core.screens';
export const HIERARCHY = 'shoutem.core.screen-hierarchy';

export default combineReducers({
  hierarchy: one(HIERARCHY, ext('hierarchy')),
});

export function updateShortcut(shortcut) {
  const config = {
    schema: SHORTCUTS,
    request: {
      endpoint: `//${url.apps}/v1/apps/${appId}/shortcuts/${shortcut.id}`,
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return update(config, {
    type: SHORTCUTS,
    ...shortcut,
  });
}


export function loadHierarchy(shortcutId) {
  const config = {
    schema: HIERARCHY,
    request: {
      endpoint: `//${url.apps}/v1/apps/${appId}/shortcuts/${shortcutId}/screen-hierarchy`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('hierarchy'));
}
