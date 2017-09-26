import * as _ from 'lodash';
import { isProduction } from 'shoutem.application';

import { getApiKeyFromState } from '../redux';

export function isFlurryActive(state) {
  const apiKey = getApiKeyFromState(state);
  return isProduction() && !_.isEmpty(apiKey);
}
