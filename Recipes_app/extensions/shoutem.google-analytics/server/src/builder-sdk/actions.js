import { update } from '@shoutem/redux-io';
import { url, appId } from 'environment';
import { EXTENSION_INSTALLATIONS } from './types';

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
