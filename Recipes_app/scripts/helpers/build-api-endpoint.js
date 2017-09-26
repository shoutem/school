'use strict';

function buildApiEndpoint(serverApiEndpoint, appId, path, production) {
  const subdomain = production ? 'prod' : 'dev';

  return `http://${subdomain}.${serverApiEndpoint}/v1/apps/${appId}/${path}`;
}

module.exports = buildApiEndpoint;
