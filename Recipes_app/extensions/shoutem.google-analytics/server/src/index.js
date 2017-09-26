import TrackersPage from './trackersPage';
import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';

const adminPages = {
  TrackersPage,
};

export {
  adminPages,
  reducer,
};

createDenormalizer(store.getState);
