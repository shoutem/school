const MAX_VISIBLE_CATEGORIES = 2;

export const ALL_CATEGORIES_OPTION = {
  key: 'all',
  label: 'All categories',
};

export function isAllCategoriesSelected(selectedCategories) {
  return _.includes(selectedCategories, ALL_CATEGORIES_OPTION.key);
}

export function getCategoriesDisplayLabel(categoryNames) {
  const visibleCategories = _.slice(categoryNames, 0, MAX_VISIBLE_CATEGORIES);
  if (categoryNames.length > MAX_VISIBLE_CATEGORIES) {
    visibleCategories.push(`+ ${(categoryNames.length - MAX_VISIBLE_CATEGORIES)} more`);
  }

  return visibleCategories.join(', ');
}
