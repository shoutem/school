import React, {
  PureComponent,
  PropTypes,
} from 'react';

import {
  Platform,
  StatusBar,
  InteractionManager,
} from 'react-native';

import {
  Icon,
  ImageGallery,
  Button,
  Screen,
  ImageGalleryOverlay,
} from '@shoutem/ui';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import { connectStyle } from '@shoutem/theme';
import _ from 'lodash';

import { ext } from '../const';

class PhotoDetails extends PureComponent {
  static propTypes = {
    photos: PropTypes.array,
    photo: PropTypes.object.isRequired,
    navigateBack: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onIndexSelected = this.onIndexSelected.bind(this);
    this.onImageGalleryModeChange = this.onImageGalleryModeChange.bind(this);
    this.onBackButton = this.onBackButton.bind(this);
    this.getNavbarProps = this.getNavbarProps.bind(this);

    this.state = {
      mode: ImageGallery.IMAGE_GALLERY_MODE,
      selectedPhotoIndex: 0,
      shouldRenderGallery: false,
    };
  }

  componentWillMount() {
    const { photo, photos } = this.props;

    const selectedPhotoIndex = _.findIndex(photos, ['id', photo.id]) || 0;

    this.setState({
      selectedPhotoIndex,
    });
  }

  onBackButton() {
    const { navigateBack } = this.props;

    navigateBack();
  }

  onIndexSelected(index) {
    this.setState({ selectedPhotoIndex: index });
  }

  onImageGalleryModeChange(newMode) {
    const { mode } = this.state;

    if (Platform.OS === 'ios') {
      const isHidden = (newMode === ImageGallery.IMAGE_PREVIEW_MODE);
      StatusBar.setHidden(isHidden, 'fade');
    }

    if (newMode !== mode) {
      this.setState({ mode: newMode });
    }
  }

  getNavbarProps() {
    const { selectedPhotoIndex, mode } = this.state;
    const { photos } = this.props;

    if (mode === ImageGallery.IMAGE_PREVIEW_MODE) {
      return {
        styleName: 'clear none',
      };
    }

    const selectedPhoto = photos[selectedPhotoIndex];

    return {
      styleName: 'clear',
      title: `${selectedPhotoIndex + 1} / ${photos.length}`,
      share: {
        title: _.get(selectedPhoto, 'title'),
        link: _.get(selectedPhoto, 'source.uri'),
      },
    };
  }

  renderImageOverlay(imageData) {
    return (
      <ImageGalleryOverlay
        styleName="full-screen"
        title={imageData.title}
        description={imageData.description}
      />
    );
  }

  render() {
    const { selectedPhotoIndex } = this.state;
    const { photos } = this.props;

    return (
      <Screen styleName="paper full-screen">
        <NavigationBar {...this.getNavbarProps()} />
        <ImageGallery
          data={photos}
          renderImageOverlay={this.renderImageOverlay}
          onIndexSelected={this.onIndexSelected}
          selectedIndex={selectedPhotoIndex}
          onModeChanged={this.onImageGalleryModeChange}
        />
      </Screen>
    );
  }
}

export default connectStyle(ext('PhotoDetails'))(PhotoDetails);
