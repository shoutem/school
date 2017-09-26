import React, { Component } from 'react';
import {
  FormGroup,
  ControlLabel,
} from 'react-bootstrap';
import { ImageUploader } from '@shoutem/web-core';
import {
  appId,
  url,
} from 'environment';
import { UndeletableS3Uploader } from '../../fileUpload';

export const MIN_HEIGHT = 135;

export default class NavigationBarBackgroundImage extends Component {
  static propTypes = {
    backgroundImage: React.PropTypes.string,
    onBackgroundImageChange: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleBackgroundUpload = this.handleBackgroundUpload.bind(this);
    this.handleBackgroundDelete = this.handleBackgroundDelete.bind(this);

    this.uploader = new UndeletableS3Uploader({
      appId,
      basePolicyServerPath: url.apps,
      folderName: 'images',
    });
  }

  handleBackgroundUpload(backgroundImage) {
    const { onBackgroundImageChange } = this.props;
    onBackgroundImageChange(backgroundImage);
  }

  handleBackgroundDelete() {
    const { onBackgroundImageChange } = this.props;
    onBackgroundImageChange(null);
  }

  render() {
    const {
      backgroundImage,
    } = this.props;
    const {
      handleBackgroundUpload,
      handleBackgroundDelete,
    } = this;

    return (
      <FormGroup className="navigation-bar-page-background-image background-settings">
        <ControlLabel>
          {`Background image (min height ${MIN_HEIGHT}px)`}
        </ControlLabel>
        <ImageUploader
          previewSize="custom"
          onUploadSuccess={handleBackgroundUpload}
          preview={backgroundImage}
          minHeight={MIN_HEIGHT}
          icon="add-photo"
          uploader={this.uploader}
          onDeleteSuccess={handleBackgroundDelete}
        />
      </FormGroup>
    );
  }
}
