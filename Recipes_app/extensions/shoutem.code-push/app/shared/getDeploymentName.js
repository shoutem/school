import { isProduction } from 'shoutem.application';

export function getDeploymentName() {
  return isProduction() ? 'Production' : 'Staging';
}
