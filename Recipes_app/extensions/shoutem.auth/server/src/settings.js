import _ from 'lodash';
import { isInitialized } from '@shoutem/redux-io';

export function getExtensionInstallationSettings(extensionInstallation) {
  if (isInitialized(extensionInstallation) && extensionInstallation.settings) {
    return extensionInstallation.settings;
  }
  return {};
}

function mergeCustomizer(objValue, srcValue) {
  // do not concatenate arrays, just replace them
  if (_.isArray(objValue)) {
    return srcValue;
  }
}

export function mergeSettings(settings, changes) {
  return _.mergeWith(settings, changes, mergeCustomizer);
}
