import { getAppId, getExtensionSettings } from 'shoutem.application';
import { ext } from '../const';

// Builds the RSS feed proxy URL for the given feed schema
export function buildFeedUrl(state, schema) {
  const appId = getAppId();
  const settings = getExtensionSettings(state, ext());
  // TODO (zeljko): The default URL shouldn't be here, but the configuration
  // is not yet available in appDidMount, we should remove this when we add
  // support for async lifecycle methods
  const baseApiEndpoint = settings.baseApiEndpoint || 'http://api.dev.sauros.hr';

  return `${baseApiEndpoint}/v1/apps/${appId}/proxy/resources/${schema}`;
}
