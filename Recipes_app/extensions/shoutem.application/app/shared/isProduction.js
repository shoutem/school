import buildConfig from '../buildConfig.json';

export function isProduction() {
  return buildConfig && buildConfig.production;
}
