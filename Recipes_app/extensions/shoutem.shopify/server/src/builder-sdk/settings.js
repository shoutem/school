import _ from 'lodash';
import { isInitialized } from '@shoutem/redux-io';
import {
  updateExtensionInstallationSettings,
  updateShortcutSettings as updateShortcut,
} from './actions';

const mergeCustomizer = (objValue, srcValue) => {
  // do not concatenate arrays, just replace them
  if (_.isArray(objValue)) {
    return srcValue;
  }
  // use default merger for other object types
  return undefined;
};

const getSettings = (originalObject) => {
  if (isInitialized(originalObject) && originalObject.settings) {
    return originalObject.settings;
  }
  return {};
};

const mergeSettings = (originalObject, objectPatch) => {
  const patchProperties = _.keys(objectPatch);
  const currentSettings = _.pick(originalObject, patchProperties);
  return _.mergeWith(currentSettings, objectPatch, mergeCustomizer);
};

export function getExtensionSettings(extensionInstallation) {
  return getSettings(extensionInstallation);
}

export function updateExtensionSettings(extensionInstallation, settingsPatch) {
  const currentSettings = getExtensionSettings(extensionInstallation);
  const settings = mergeSettings(currentSettings, settingsPatch);
  return updateExtensionInstallationSettings(extensionInstallation.id, settings);
}

export function getShortcutSettings(shortcut) {
  return getSettings(shortcut);
}

export function updateShortcutSettings(shortcut, settingsPatch) {
  const currentSettings = getShortcutSettings(shortcut);
  const settings = mergeSettings(currentSettings, settingsPatch);
  return updateShortcut(shortcut.id, settings);
}
