import React from 'react';
import { connect } from 'react-redux';

import {
  BooksListScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './BooksListScreen';
import SmallListBooksView from '../components/SmallListBooksView';

class BooksSmallListScreen extends BooksListScreen {

  constructor(props, context) {
    super(props, context);
    this.renderRow = this.renderRow.bind(this);

    this.state.renderCategoriesInline = false;
  }

  renderRow(book) {
    return (
      <SmallListBooksView
        key={book.id}
        book={book}
        onPress={this.openDetailsScreen}
        hasFavoriteButton={this.props.hasFavorites}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BooksSmallListScreen);
