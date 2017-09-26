import React from 'react';
import { connect } from 'react-redux';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { CmsListScreen } from 'shoutem.cms';
import { isFavoritesSchema, getFavoriteCollection } from 'shoutem.favorites';

import { ext } from '../const';
import ListBooksView from '../components/ListBooksView';

export class BooksListScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
    navigateTo: React.PropTypes.func,
    hasFavorites: React.PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);

    const schema = ext('Books');
    this.state = {
      ...this.state,
      schema,
    };
  }

  openDetailsScreen(book) {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('BooksDetailsScreen'),
      props: {
        book,
        hasFavoriteButton: this.props.hasFavorites,
      },
    });
  }

  renderRow(book) {
    return (
      <ListBooksView
        key={book.id}
        book={book}
        onPress={this.openDetailsScreen}
        hasFavoriteButton={this.props.hasFavorites}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => ({
  ...CmsListScreen.createMapStateToProps(state => state[ext()].allBooks)(state, ownProps),
  hasFavorites: isFavoritesSchema(state, ext('Books')),
  favoriteBooks: getFavoriteCollection(ext('Books'), state),
});

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('BooksListScreen'), {})(BooksListScreen),
);
