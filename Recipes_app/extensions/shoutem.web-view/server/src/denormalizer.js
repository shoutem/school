import { ReduxApiStateDenormalizer } from '@shoutem/redux-io';
import { ext } from 'context';
import { SHORTCUTS } from './webPage/reducer';

// define your storage mappings here
const denormalizerMappings = {
  [SHORTCUTS]: [ext(), 'storage', SHORTCUTS],
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
  return denormalizer.denormalizeItem(...args);
}
