import React from 'react';
import { Dimensions } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { cloneStatus } from '@shoutem/redux-io';
import {
  connectStyle,
  getSizeRelativeToReference,
} from '@shoutem/theme';

import {
  GridRow,
  View,
} from '@shoutem/ui';

import { ext } from '../const';

import {
  PhotosBaseScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './PhotosBaseScreen';

import GridPhotoView from '../components/GridPhotoView';

const window = Dimensions.get('window');

const NUMBER_OF_COLUMNS = 3;

function getCellDimension(numberOfColumns) {
  // Width and height of cell is 110px when numberOfColumns = 3, which is default.
  // Implemented like this if we ever introduce additional layout with two columns.
  let dimension = 110;
  if (numberOfColumns === 2) {
    dimension = 167;
  }
  return getSizeRelativeToReference(dimension, 375, window.width);
}

class PhotosGrid extends PhotosBaseScreen {
  static propTypes = {
    ...PhotosBaseScreen.propTypes,
  };

  constructor(props) {
    super(props);
    this.renderCellRow = this.renderCellRow.bind(this);
  }

  renderCellRow(photo) {
    return (
      <View key={photo.id}>
        <GridPhotoView
          photo={photo}
          onPress={this.openDetailsScreen}
          width={getCellDimension(NUMBER_OF_COLUMNS)}
          height={getCellDimension(NUMBER_OF_COLUMNS)}
        />
      </View>
    );
  }

  remapPhotosToCells(photos) {
    // Render the GridPhotoView within a GridRow for all photos
    return _.map(photos, this.renderCellRow);
  }

  renderRow(photos) {
    const photoViews = this.remapPhotosToCells(photos);
    return (
      <GridRow
        columns={NUMBER_OF_COLUMNS}
        key={photos[0].id}
      >
        {photoViews}
      </GridRow>
    );
  }

  renderData() {
    const { photos } = this.state;

    const groupedPhotos = GridRow.groupByRows(photos, NUMBER_OF_COLUMNS);
    cloneStatus(photos, groupedPhotos);

    return super.renderData(groupedPhotos);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PhotosGrid'))(PhotosGrid),
);
