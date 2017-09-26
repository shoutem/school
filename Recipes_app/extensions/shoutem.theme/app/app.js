import _ from 'lodash';
import { getActiveTheme } from './redux';
import { appThemeAssets } from './services/AppThemeAssets';
import { getConfiguration } from 'shoutem.application';

let activeTheme;

/**
 * Resolves given theme style.
 * @param theme Denormalized theme object from state
 * @param app Application instance
 * @returns {*} Resolved theme style
 */
function resolveThemeStyle(theme, app) {
  const themes = app.getThemes();
  const initTheme = themes[theme.canonicalName];

  if (!initTheme) {
    throw Error(
      `Resolving "${theme.canonicalName}" but couldn't be found in application.` +
      'This usually happen when theme extension is not installed.'
    );
  } else if (!_.isFunction(initTheme)) {
    throw Error(`Theme "${theme.canonicalName}" is not exporting a function.`);
  }

  const variables = _.get(theme, 'settings.variables');

  return initTheme(variables);
}

/**
 * Triggers every time activeTheme is changed in the configuration.
 * @param app ShoutEm App instance
 * @param onChange Active theme event listener
 */
function watchActiveTheme(app, onChange) {
  const store = app.getStore();
  store.subscribe(() => {
    const theme = getActiveTheme(store.getState());
    if (theme && theme !== activeTheme) {
      activeTheme = theme;
      onChange(theme);
    }
  });
}
/**
 * Update theme assets with configuration default and active theme assets.
 * @param configuration Denormalized configuration
 */
function updateThemeAssets(configuration) {
  if (!configuration) {
    return;
  }
  appThemeAssets.updateActiveIconsMap(configuration.defaultTheme, configuration.activeTheme);
}

export const appWillMount = function (app) {
  // Active theme can not change without previous configuration change event,
  // where next active theme is already set in configuration.
  watchActiveTheme(app, theme => app.setStyle(resolveThemeStyle(theme, app)));
};

export const appDidMount = function (app) {
  const store = app.getStore();
  const configuration = getConfiguration(store.getState());
  // Active theme is always taken from configuration.activeTheme
  updateThemeAssets(configuration);
};
