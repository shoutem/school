import React from 'react';
import _ from 'lodash';

import {
  find,
  next,
  cloneStatus,
} from '@shoutem/redux-io';

import { RssListScreen } from 'shoutem.rss';
import { openInModal } from '@shoutem/core/navigation';

import { ext } from '../const';
import {
  RSS_PHOTOS_SCHEMA,
  getPhotosFeed,
} from '../reducers/';

export function remapAndFilterPhotos(data) {
  // Delete objects from `data` if they do not have url in `image` set
  const filteredPhotos = _.filter(data, photo => _.get(_.head(photo.imageAttachments), 'src'));
  // Remap objects only on one place, to avoid remapping few times later
  const photos = _.map(filteredPhotos, (photo, id) => {
    return {
      source: {
        uri: _.get(_.head(photo.imageAttachments), 'src'),
      },
      title: _.get(photo, 'title'),
      description: _.get(photo, 'summary'),
      id: `${_.get(photo, 'id')}${id}`,
      timeUpdated: _.get(photo, 'timeUpdated'),
    };
  });

  cloneStatus(data, photos);

  return photos;
}

export class PhotosBaseScreen extends RssListScreen {
  static propTypes = {
    ...RssListScreen.propTypes,
    openInModal: React.PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.openDetailsScreen = this.openDetailsScreen.bind(this);
    this.renderRow = this.renderRow.bind(this);

    const photos = remapAndFilterPhotos(this.props.data);

    this.state = {
      ...this.state,
      schema: RSS_PHOTOS_SCHEMA,
      photos,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      const photos = remapAndFilterPhotos(nextProps.data);
      this.setState({ photos });
    }
  }

  openDetailsScreen(photo) {
    const { openInModal } = this.props;
    const { photos } = this.state;
    const route = {
      screen: ext('PhotoDetails'),
      props: {
        photo,
        photos,
      },
    };

    openInModal(route);
  }
}

export const mapStateToProps = (state, ownProps) => {
  const feedUrl = _.get(ownProps, 'shortcut.settings.feedUrl');

  return {
    feedUrl,
    data: getPhotosFeed(state, feedUrl),
  };
};

export const mapDispatchToProps = {
  openInModal,
  find,
  next,
};
