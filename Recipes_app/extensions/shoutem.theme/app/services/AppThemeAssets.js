import { getActiveTheme, getDefaultTheme } from '../redux';

/**
 * Create icons map from theme.
 * Map key is icon name and value is icon url.
 * @param theme Denormalized theme object.
 * @returns {*}
 */
function resolveThemeIconsMap(theme) {
  if (!theme || !theme.iconsIncluded) {
    throw Error(
      'Trying to resolve theme icons map but ' +
      'provided theme didn\'t implement Shoutem theme interface.' +
      'Shoutem theme should have "iconsIncluded" property.'
    );
  }
  return theme.iconsIncluded.reduce((iconsMap, iconName) => {
    // eslint-disable-next-line no-param-reassign
    iconsMap[iconName] = theme.icons + iconName;
    return iconsMap;
  }, {});
}

class AppThemeAssets {
  constructor() {
    this.activeIconsMap = {};
  }

  /**
   * Update active icons map with default and active theme icons from the state.
   * @param state Application redux state
   */
  resolveActiveIconsMap(state) {
    const defaultTheme = getDefaultTheme(state);
    const activeTheme = getActiveTheme(state);

    if (!defaultTheme) {
      throw Error(
        'Missing `defaultTheme`, must be defined in configuration.'
      );
    }

    // If activeTheme doesn't exists it will be ignored
    this.updateActiveIconsMap(defaultTheme, activeTheme);
  }

  /**
   * Reset theme icons map and creates new with provided themes.
   * @param defaultTheme Default theme object from configuration
   * @param activeTheme Active theme object from configuration
   */
  updateActiveIconsMap(defaultTheme, activeTheme) {
    this.activeIconsMap = resolveThemeIconsMap(defaultTheme);

    if (activeTheme && defaultTheme !== activeTheme) {
      this.activeIconsMap = {
        ...this.activeIconsMap,
        ...resolveThemeIconsMap(activeTheme),
      };
    }
  }

  /**
   * Return active icon url for icon name.
   * @param iconName Requested icon name
   * @returns {string|undefined} Requested icon url or undefined if it doesn't exists
   */
  getIconUrl(iconName) {
    return this.activeIconsMap[iconName];
  }
}

export const appThemeAssets = new AppThemeAssets();
