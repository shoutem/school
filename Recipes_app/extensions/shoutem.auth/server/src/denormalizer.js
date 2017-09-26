import { ReduxApiStateDenormalizer } from '@shoutem/redux-io';
import { ext } from 'context';
import { EXTENSION_INSTALLATIONS, SHORTCUTS, LEGACY_APPLICATION_SETTINGS } from './types';

// define your storage mappings here
const denormalizerMappings = {
  [EXTENSION_INSTALLATIONS]: [ext(), 'storage', EXTENSION_INSTALLATIONS],
  [SHORTCUTS]: [ext(), 'storage', SHORTCUTS],
  [LEGACY_APPLICATION_SETTINGS]: [ext(), 'storage', LEGACY_APPLICATION_SETTINGS],
};

let denormalizer = null;

export function createDenormalizer(getState) {
  if (denormalizer === null) {
    denormalizer = new ReduxApiStateDenormalizer(getState, denormalizerMappings);
  }
}

export function getDenormalizer() {
  return denormalizer;
}

export function denormalizeCollection(...args) {
  return denormalizer.denormalizeCollection(...args);
}

export function denormalizeItem(...args) {
  return denormalizer.denormalizeOne(...args);
}
