import _ from 'lodash';
import { isInitialized } from '@shoutem/redux-io';
import {
  updateExtensionInstallationSettings,
} from './actions';

const getSettings = originalObject => {
  if (isInitialized(originalObject) && originalObject.settings) {
    return originalObject.settings;
  }
  return {};
};

const mergeSettings = (originalObject, objectPatch) => {
  const patchProperties = _.keys(objectPatch);
  _.forEach(patchProperties, (propertyName) => {
    originalObject[propertyName] = objectPatch[propertyName]; // eslint-disable-line
  });
  return originalObject;
};

export function getExtensionSettings(extensionInstallation) {
  return getSettings(extensionInstallation);
}

export function getExtensionSettingsValue(extensionInstallation, propertyName) {
  const settings = getExtensionSettings(extensionInstallation);
  if (!settings) {
    return null;
  }
  return (!_.isUndefined(settings[propertyName])) ? settings[propertyName] : null;
}

export function updateExtensionSettings(extensionInstallation, settingsPatch) {
  const currentSettings = getExtensionSettings(extensionInstallation);
  const settings = mergeSettings(currentSettings, settingsPatch);
  return updateExtensionInstallationSettings(extensionInstallation.id, settings);
}
