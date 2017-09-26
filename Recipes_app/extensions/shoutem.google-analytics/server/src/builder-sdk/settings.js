import _ from 'lodash';
import { isInitialized } from '@shoutem/redux-io';
import { updateExtensionInstallationSettings } from './actions';

const mergeCustomizer = (objValue, srcValue) => {
  // do not concatenate arrays, just replace them
  if (_.isArray(objValue)) {
    return srcValue;
  }
  // use default merger for other object types
  return null;
};

export function getExtensionSettings(extensionInstallation) {
  if (isInitialized(extensionInstallation) && extensionInstallation.settings) {
    return extensionInstallation.settings;
  }
  return {};
}

export function updateExtensionSettings(extensionInstallation, settingsPatch) {
  const patchProperties = _.keys(settingsPatch);
  const currentSettings = _.pick(getExtensionSettings(extensionInstallation), patchProperties);
  const settings = _.mergeWith(currentSettings, settingsPatch, mergeCustomizer);

  return updateExtensionInstallationSettings(extensionInstallation.id, settings);
}
