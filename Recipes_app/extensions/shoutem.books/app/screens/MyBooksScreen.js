import React from 'react';
import { connect } from 'react-redux';

import * as _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import {
  isError,
  getCollection,
  isBusy,
  isInitialized,
} from '@shoutem/redux-io';
import { navigateTo } from '@shoutem/core/navigation';
import {
  ListView,
  Screen,
} from '@shoutem/ui';
import { EmptyStateView } from '@shoutem/ui-addons';
import { NavigationBar } from '@shoutem/ui/navigation';

import { CmsListScreen } from 'shoutem.cms';
import { getFavoriteItems, fetchFavoritesData } from 'shoutem.favorites';

import ListBooksView from '../components/ListBooksView';
import { ext } from '../const';

class MyBooksScreen extends React.Component {
  static propTypes = {
    navigateTo: React.PropTypes.func,
    title: React.PropTypes.string,
    data: React.PropTypes.array.isRequired,
    favorites: React.PropTypes.object.isRequired,
    fetchFavoritesData: React.PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      schema: ext('Books'),
    };
  }

  componentDidMount() {
    const { fetchFavoritesData, favorites } = this.props;

    fetchFavoritesData(this.state.schema, favorites[this.state.schema]);
  }

  componentWillReceiveProps(newProps) {
    const { fetchFavoritesData, favorites } = this.props;

    if (newProps.favorites !== favorites) {
      fetchFavoritesData(this.state.schema, newProps.favorites[this.state.schema]);
    }
  }

  openDetailsScreen(book) {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('BooksDetailsScreen'),
      props: {
        book,
        hasFavoriteButton: true,
      },
    });
  }

  isCollectionValid(collection) {
    if (!isInitialized(collection) || isBusy(collection)) {
      // The collection is loading, treat it as valid for now
      return true;
    }

    // The collection is considered valid if it is not empty
    return !_.isEmpty(collection);
  }

  renderPlaceholderView() {
    const { data } = this.props;

    const message = isError(data) ?
      'Unexpected error occurred.' : 'Nothing here at this moment.';

    return (
      <EmptyStateView icon="books" message={message} />
    );
  }

  renderRow(book) {
    return (
      <ListBooksView
        key={book.id}
        book={book}
        onPress={this.openDetailsScreen}
        hasFavoriteButton
      />
    );
  }

  renderData(data) {
    if (!this.isCollectionValid(data)) {
      return this.renderPlaceholderView();
    }

    const loading = isBusy(data) || !isInitialized(data);

    return (
      <ListView
        data={data}
        renderRow={this.renderRow}
        loading={loading}
      />
    );
  }

  render() {
    const { title, data } = this.props;
    return (
      <Screen>
        <NavigationBar
          title={title}
        />
        {this.renderData(data)}
      </Screen>
    );
  }
}

export const mapStateToProps = state => ({
  favorites: getFavoriteItems(state),
  data: getCollection(state[ext()].favoriteBooks, state),
});

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  navigateTo,
  fetchFavoritesData,
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('MyBooksScreen'), {})(MyBooksScreen),
);
