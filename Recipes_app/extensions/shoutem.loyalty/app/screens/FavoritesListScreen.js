import { connectStyle } from '@shoutem/theme';
import React from 'react';
import { LayoutAnimation } from 'react-native';
import { FavoritesListScreen } from 'shoutem.favorites';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Button,
  View,
  Text,
} from '@shoutem/ui';

import MapList from '../components/MapList';
import PlaceIconView from '../components/PlaceIconView';
import { ext } from '../const';

export class FavoritesList extends FavoritesListScreen {
  static propTypes = {
    ...FavoritesListScreen.PropTypes,
  };

  constructor(props, context) {
    super(props, context);
    this.renderData = this.renderData.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.toggleMapView = this.toggleMapView.bind(this);
    this.renderFavorite = this.renderFavorite.bind(this);
    this.shouldRenderMap = this.shouldRenderMap.bind(this);
    this.state = {
      ...this.state,
      schema: ext('places'),
      mapView: false,
    };
  }

  componentWillReceiveProps(newProps) {
    const { favorites } = newProps;

    if (!this.shouldRenderMap(favorites)) {
      this.setState({ mapView: false });
    }
  }

  shouldRenderMap(favorites) {
    const { mapView } = this.state;

    return (!_.isEmpty(favorites) && mapView);
  }

  getNavBarProps() {
    const { title } = this.props;

    return {
      title,
      // We use an arrow function here because otherwise the right component doesn't re-render
      renderRightComponent: () => this.renderRightNavBarComponent(),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  renderFavorite(place) {
    return <PlaceIconView place={place} />;
  }

  toggleMapView() {
    const { mapView } = this.state;

    LayoutAnimation.easeInEaseOut();
    this.setState({ mapView: !mapView });
  }

  renderRightNavBarComponent() {
    const { mapView } = this.state;
    const { favorites } = this.props;

    const actionText = mapView ? 'List' : 'Map';

    if (_.isEmpty(favorites)) {
      return null;
    }

    return (
      <View virtual styleName="container md-gutter-right">
        <Button
          styleName="tight"
          onPress={this.toggleMapView}
        >
          <Text>{actionText}</Text>
        </Button>
      </View>
    );
  }

  renderData(favorites) {
    if (this.shouldRenderMap(favorites)) {
      return (
        <MapList
          places={favorites}
        />
      );
    }
    return super.renderData(favorites);
  }
}

export const mapStateToProps = FavoritesListScreen.createMapStateToProps(ext('places'));

export default connect(mapStateToProps, undefined)(
  connectStyle(ext('FavoritesList'), {})(FavoritesList),
);
