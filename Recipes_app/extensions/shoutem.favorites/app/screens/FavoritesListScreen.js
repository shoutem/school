import React, { Component } from 'react';
import { getCollection } from '@shoutem/redux-io';
import { NavigationBar } from '@shoutem/ui/navigation';
import { LayoutAnimation } from 'react-native';
import _ from 'lodash';
import {
  Screen,
  ListView,
} from '@shoutem/ui';
import { EmptyStateView } from '@shoutem/ui-addons';

import { getFavoriteCollection } from 'shoutem.favorites';

export class FavoritesListScreen extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    favorites: React.PropTypes.array,
  };

  static createMapStateToProps(schema) {
    return (state) => {
      const favoriteCollection = getFavoriteCollection(schema, state);
      const favoriteIds = _.map(favoriteCollection, 'id');
      const favorites = getCollection(favoriteIds, state, schema);

      return { favorites };
    };
  }

  constructor(props, context) {
    super(props, context);
    this.renderData = this.renderData.bind(this);
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  getNavBarProps() {
    const { title } = this.props;

    return { title };
  }

  renderData(favoriteData) {
    if (_.isEmpty(favoriteData)) {
      return (
        <EmptyStateView
          onRetry={this.refreshData}
          message="This screen will list your favorites once you add them"
          icon="add-to-favorites-on"
        />
      );
    }

    return (
      <ListView
        data={favoriteData}
        renderRow={this.renderFavorite}
        pageSize={20}
      />
    );
  }

  render() {
    const { favorites } = this.props;

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        {this.renderData(favorites)}
      </Screen>
    );
  }
}
