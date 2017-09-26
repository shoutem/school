// Constants `screens` and `reducer` are exported via named export
// It is important to use those exact names

export const screens = {};

export const reducer = {};

import Rubicon, { defaultThemeVariables } from './themes/Rubicon';
const getTheme = Rubicon;
const themes = {
  Rubicon,
  RubiconBleu: Rubicon,
  RubiconNoir: Rubicon,
  RubiconRose: Rubicon,
};

export {
  getTheme,
  defaultThemeVariables,
  themes,
};
