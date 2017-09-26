import { appThemeAssets } from '../services/AppThemeAssets';

// Custom icon url starts with "theme://"
export const customIconUrlRegex = /^theme:\/\//;

/**
 * Strip custom theme prefix and return icon name.
 *
 * @param icon
 * @returns string
 */
function getIconName(icon) {
  return icon.replace(customIconUrlRegex, '');
}

/**
 * Return icon (http) url.
 * Resolve custom theme icon url if provided.
 *
 * @param icon string
 * @returns string
 */
export function resolveIconUrl(icon) {
  if (customIconUrlRegex.test(icon)) {
    return appThemeAssets.getIconUrl(getIconName(icon));
  }
  return icon;
}
