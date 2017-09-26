import VimeoPage from './VimeoPage/components/Rss';
import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';

const adminPages = {
  VimeoPage,
};

export {
  adminPages,
  reducer,
};

createDenormalizer(store.getState);
