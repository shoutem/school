import * as _ from 'lodash';
import { Platform } from 'react-native';

import { getExtensionSettings } from 'shoutem.application';
import { ext } from './const';
import { getDeploymentName } from './shared/getDeploymentName';

export function getDeploymentFromState(state) {
  const codePushExtension = getExtensionSettings(state, ext());
  const devicePlatform = Platform.OS;
  const deployments = _.get(codePushExtension, `${devicePlatform}.deploymentKeys`);
  return _.find(deployments, { name: getDeploymentName() });
}
