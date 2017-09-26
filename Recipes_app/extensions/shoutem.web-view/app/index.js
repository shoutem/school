import WebViewScreen from './screens/WebViewScreen';
import * as actions from './redux';

import {
  openWebViewScreen,
 } from './middleware';

const screens = {
  WebViewScreen,
};

const middleware = [
  openWebViewScreen,
];

const { openURL } = actions;

export {
  screens,
  middleware,
  actions,
  openURL,
};
