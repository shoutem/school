import { ReduxApiStateDenormalizer } from '@shoutem/redux-io';
import { ext } from 'context';
import { EXTENSION_INSTALLATIONS } from './types';

// define your storage mappings here
const denormalizerMappings = {
  [EXTENSION_INSTALLATIONS]: [ext(), 'storage', EXTENSION_INSTALLATIONS],
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
