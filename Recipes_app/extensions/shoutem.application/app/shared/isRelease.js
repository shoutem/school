import buildConfig from '../buildConfig.json';

export function isRelease() {
  return buildConfig && buildConfig.release;
}
