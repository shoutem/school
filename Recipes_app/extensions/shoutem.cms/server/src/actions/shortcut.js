import { updateShortcutSettings } from '../builder-sdk';
import { invalidate } from '@shoutem/redux-io';
import { CATEGORIES, CURRENT_SCHEMA } from '../types';

export function updateShortcutCategories(
  shortcut,
  parentCategoryId,
  visibleCategoryIds = [],
  schema = CURRENT_SCHEMA,
) {
  const visibleCategories = _.map(visibleCategoryIds, categoryId => ({
    type: CATEGORIES,
    id: categoryId,
  }));

  return (dispatch) => {
    const patch = {
      parentCategory: {
        type: CATEGORIES,
        id: parentCategoryId,
      },
      visibleCategories,
    };

    return dispatch(updateShortcutSettings(shortcut, patch))
      .then(() => dispatch(invalidate(schema)));
  };
}
