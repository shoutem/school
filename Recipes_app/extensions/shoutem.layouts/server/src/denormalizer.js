import { ReduxApiStateDenormalizer } from '@shoutem/redux-io';
import { SHORTCUTS, SCREENS, HIERARCHY } from './layoutPage/reducer';
import { ext } from 'context';

// define your storage mappings here
const denormalizerMappings = {
  [SHORTCUTS]: [ext(), 'storage', SHORTCUTS],
  [SCREENS]: [ext(), 'storage', SCREENS],
  [HIERARCHY]: [ext(), 'storage', HIERARCHY],
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
