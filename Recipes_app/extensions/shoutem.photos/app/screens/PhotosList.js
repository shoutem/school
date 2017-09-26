import React from 'react';

import { connectStyle } from '@shoutem/theme';
import { connect } from 'react-redux';

import { ext } from '../const';
import {
  PhotosBaseScreen,
  mapStateToProps,
  mapDispatchToProps,
} from './PhotosBaseScreen';
import ListPhotoView from '../components/ListPhotoView';

export class PhotosList extends PhotosBaseScreen {
  static propTypes = {
    ...PhotosBaseScreen.propTypes,
  };

  renderRow(photo) {
    return (
      <ListPhotoView
        key={photo.id}
        photo={photo}
        onPress={this.openDetailsScreen}
      />
    );
  }

  renderData() {
    const { photos } = this.state;
    // We're overriding renderData method by providing it
    // filtered and remaped photos (from state)
    return super.renderData(photos);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PhotosList'))(PhotosList),
);
