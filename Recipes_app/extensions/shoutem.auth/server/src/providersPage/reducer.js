import { combineReducers } from 'redux';
import { one, find, update } from '@shoutem/redux-io';
import { url, appId } from 'environment';
import { ext } from 'context';
import { EXTENSION_INSTALLATIONS, LEGACY_APPLICATION_SETTINGS } from 'types';

export default combineReducers({
  legacyApplicationSettings: one(LEGACY_APPLICATION_SETTINGS, ext('legacyApplicationSettings'))
});

export function updateExtensionInstallationSettings(id, settings) {
  const config = {
    schema: EXTENSION_INSTALLATIONS,
    request: {
      endpoint: `//${url.apps}/v1/apps/${appId}/installations/${id}`,
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const partialInstallation = {
    type: EXTENSION_INSTALLATIONS,
    id,
    attributes: {
      settings,
    },
  };

  return update(config, partialInstallation);
}

export function loadLegacyApplicationSettings() {
  const config = {
    schema: LEGACY_APPLICATION_SETTINGS,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/legacy-settings`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };
  return find(config, ext('legacyApplicationSettings'));
}

export function updateLegacyApplicationSettings(settings) {
  const config = {
    schema: LEGACY_APPLICATION_SETTINGS,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/legacy-settings`,
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const partialSettings = {
    type: LEGACY_APPLICATION_SETTINGS,
    id: appId,
    attributes: {
      ...settings,
    },
  };

  return update(config, partialSettings);
}
