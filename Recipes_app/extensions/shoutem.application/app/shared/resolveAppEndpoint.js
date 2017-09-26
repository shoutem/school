import buildConfig from '../buildConfig.json';

function getAppEndpointBase(appId) {
  return `http://${buildConfig.serverApiEndpoint}/v1/apps/${appId}/`;
}

export function resolveAppEndpoint(path = '', appId) {
  return `${getAppEndpointBase(appId)}${path}`;
}
