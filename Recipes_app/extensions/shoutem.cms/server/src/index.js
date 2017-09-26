import CmsPage from './pages/cmsPage';
import CmsSettingsPage from './pages/settingsPage';
import reducer from './reducer';
import { createDenormalizer } from 'denormalizer';
import { store } from 'context';

const adminPages = {
  CmsPage,
  CmsSettingsPage,
};

export {
  adminPages,
  reducer,
};

createDenormalizer(store.getState);
