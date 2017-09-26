import LayoutPage from './layoutPage/components/LayoutPage';
import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';
import { getShortcut } from 'environment';

const adminPages = {
  LayoutPage,
};

export {
  adminPages,
  reducer,
};

createDenormalizer(store.getState);
