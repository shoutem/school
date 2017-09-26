import React from 'react';

import {
  Text,
  Button,
  Icon,
} from '@shoutem/ui';

import { renderBuyTitle } from '../shared/renderBuyTitle';

export function LinkButton({ book, onPress }) {
  if (book.buyUrl) {
    return (
      <Button styleName="sm-gutter-top" onPress={() => onPress(book.buyUrl, book.title)}>
        <Icon name="cart" />
        <Text style={{ marginLeft: 0 }}>{renderBuyTitle(book)}</Text>
      </Button>
    );
  }
  return null;
}

LinkButton.propTypes = {
  book: React.PropTypes.any,
  onPress: React.PropTypes.func,
};
