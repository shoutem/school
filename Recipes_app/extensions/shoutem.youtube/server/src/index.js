// Constants `screens`, `actions` and `reducer` are exported via named export
// It is important to use those exact names

import SettingsPage from './pages/settings-page';
import YoutubeFeedPage from './pages/youtube-feed-page';
import reducer from './redux';

export const pages = {
  SettingsPage,
  YoutubeFeedPage,
};

export { reducer };
