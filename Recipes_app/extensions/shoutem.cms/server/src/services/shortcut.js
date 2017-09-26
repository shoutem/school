import _ from 'lodash';

/**
 * Resolves sort options object from shortcut settings
 */
export function getSortOptions(shortcut) {
  const field = _.get(shortcut, 'settings.sortField');
  const order = _.get(shortcut, 'settings.sortOrder');

  // we consider sort settings set if they have value
  const hasSortSettings = !!field && !!order;
  if (!hasSortSettings) {
    return null;
  }

  return {
    field,
    order,
  };
}

export function getParentCategoryId(shortcut) {
  return _.get(shortcut, 'settings.parentCategory.id');
}

export function getVisibleCategoryIds(shortcut) {
  const visibleCategories = _.get(shortcut, 'settings.visibleCategories', []);
  return _.map(visibleCategories, 'id');
}
