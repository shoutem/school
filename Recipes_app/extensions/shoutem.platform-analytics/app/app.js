import { isProduction } from 'shoutem.application';
import { registerExtensionTrackers } from 'shoutem.google-analytics';

import { ext } from './const';

export function appDidMount(app) {
  if (isProduction()) {
    registerExtensionTrackers(ext(), app);
  }
}
