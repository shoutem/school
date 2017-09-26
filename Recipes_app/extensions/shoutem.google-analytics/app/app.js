import { isProduction } from 'shoutem.application';

import { ext } from './const';
import { registerExtensionTrackers } from './helpers/registerExtensionTrackers';

export function appDidMount(app) {
  if (isProduction()) {
    registerExtensionTrackers(ext(), app);
  }
}
