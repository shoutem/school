import RssPage from './rssPage/components/Rss';
import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';
import { getShortcut } from 'environment';

const adminPages = {
  RssPage,
};

export {
  adminPages,
  reducer
};

createDenormalizer(store.getState);
