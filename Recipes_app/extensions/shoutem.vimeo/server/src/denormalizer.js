import { ReduxApiStateDenormalizer } from '@shoutem/redux-io';
import { DISCOVERED_FEEDS, FEED_ITEMS } from './VimeoPage/reducer';
import { ext } from 'context';

// define your storage mappings here
const denormalizerMappings = {
  [DISCOVERED_FEEDS]: [ext(), 'storage', DISCOVERED_FEEDS],
  [FEED_ITEMS]: [ext(), 'storage', FEED_ITEMS],
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
