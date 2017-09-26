import * as _ from 'lodash';
import { Platform } from 'react-native';

import { getExtensionSettings } from 'shoutem.application';
import { ext } from './extension';

export function getApiKeyFromState(state) {
  const flurryExtensionSettings = getExtensionSettings(state, ext());
  const devicePlatform = Platform.OS;
  return _.get(flurryExtensionSettings, [devicePlatform, 'apiKey']);
}
