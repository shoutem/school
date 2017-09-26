import React from 'react';
import { connect } from 'react-redux';
import { LayoutAnimation } from 'react-native';
import _ from 'lodash';

import { connectStyle } from '@shoutem/theme';
import {
  View,
  Text,
  ListView,
  Screen,
  Button,
} from '@shoutem/ui';
import {
  isBusy,
  find,
  isInitialized,
} from '@shoutem/redux-io';
import { NavigationBar } from '@shoutem/ui/navigation';

import { CmsListScreen, currentLocation } from 'shoutem.cms';

import MapList from '../components/MapList';
import PlacePhotoView from '../components/PlacePhotoView';
import { ext } from '../const';

export class PlacesList extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);
    this.renderRightNavBarComponent = this.renderRightNavBarComponent.bind(this);
    this.toggleMapView = this.toggleMapView.bind(this);
    this.isDataLoading = this.isDataLoading.bind(this);

    this.state = {
      ...this.state,
      schema: ext('places'),
      renderCategoriesInline: true,
      mapView: false,
    };
  }

  fetchData(options) {
    LayoutAnimation.easeInEaseOut();
    return super.fetchData(options);
  }

  toggleMapView() {
    const { mapView } = this.state;

    LayoutAnimation.easeInEaseOut();
    this.setState({ mapView: !mapView });
  }

  renderRightNavBarComponent() {
    const { mapView } = this.state;
    const actionText = mapView ? 'List' : 'Map';

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

  getNavBarProps() {
    return {
      ...super.getNavBarProps(),
      renderRightComponent: () => this.renderRightNavBarComponent(),
    };
  }

  renderRow(place) {
    return <PlacePhotoView place={place} />;
  }

  isDataLoading(data) {
    const { permission } = this.props.permissionStatus;

    return isBusy(data) || !isInitialized(data) || permission === undefined;
  }

  renderData(data) {
    const { mapView } = this.state;
    const loading = this.isDataLoading(data);

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    if (mapView) {
      return <MapList places={data} />;
    }

    return (
      <ListView
        data={data}
        loading={loading}
        renderRow={this.renderRow}
        onRefresh={this.refreshData}
        onLoadMore={this.loadMore}
        getSectionId={this.getSectionId}
        renderSectionHeader={this.renderSectionHeader}
        initialListSize={1}
      />
    );
  }

  render() {
    const { data } = this.props;
    const { renderCategoriesInline } = this.state;

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        {renderCategoriesInline ? this.renderCategoriesDropDown('horizontal') : null}
        {this.renderData(data)}
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => ({
  ...CmsListScreen.createMapStateToProps(state => state[ext()].allPlaces)(state, ownProps),
});

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps({
  find,
});

const StyledPlacesList = connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PlacesList'))(currentLocation(PlacesList)),
);

export {
  StyledPlacesList as PlacesListScreen,
};
