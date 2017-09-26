import React, { PropTypes, Component } from 'react';
import { ControlLabel, Row, Col, FormGroup } from 'react-bootstrap';
import { ImageUploader } from '@shoutem/web-core';
import { url, appId } from 'environment';
import { UndeletableS3Uploader } from '../../../fileUpload';
import form from '../form';
import DropdownWrapper from '../DropdownWrapper';
import './style.scss';

const configuration = {
  default: {
    parallaxEffect: 'onDeviceOrientation',
  },
  parallaxEffect: {
    onDeviceOrientation: 'On device orientation',
    onScroll: 'On scroll',
  },
};

export class BackgroundSettings extends Component {
  constructor(props) {
    super(props);

    this.saveForm = this.saveForm.bind(this);
    this.handleBackgroundDeleteSuccess = this.handleBackgroundDeleteSuccess.bind(this);

    props.onFieldChange(this.saveForm);
    this.uploader = new UndeletableS3Uploader({
      appId,
      basePolicyServerPath: url.apps,
      folderName: 'images',
    });
  }

  saveForm() {
    const newSettings = this.props.form.toObject();
    this.props.onSettingsChanged(newSettings);
  }

  handleBackgroundDeleteSuccess() {
    const { onSettingsChanged } = this.props;
    const newSettings = {
      backgroundImage: null,
    };
    onSettingsChanged(newSettings);
  }

  render() {
    const { parallaxEffect, backgroundImage } = this.props.fields;
    const minWidth = 750;
    const minHeight = 1136;

    return (
      <div className="background-settings">
        <h3>Background settings</h3>
        <form>
          <FormGroup>
            <Row>
              <Col md={7}>
                <ControlLabel>{`Screen background (min ${minWidth}x${minHeight}px)`}</ControlLabel>
                <ImageUploader
                  previewSize="custom"
                  onUploadSuccess={backgroundImage.onChange}
                  preview={backgroundImage.value}
                  minWidth={minWidth}
                  minHeight={minHeight}
                  icon="add-photo"
                  uploader={this.uploader}
                  onDeleteSuccess={this.handleBackgroundDeleteSuccess}
                />
              </Col>
              {/* <Col md={5}>
                <ControlLabel>Parallax effect</ControlLabel>
                <DropdownWrapper
                  valuesMap={configuration.parallaxEffect}
                  defaultKey={configuration.default.parallaxEffect}
                  field={parallaxEffect}
                />
              </Col> */}
            </Row>
          </FormGroup>
        </form>
      </div>
    );
  }
}

BackgroundSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func,
  form: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.string),
};

export default form((props) => {
  const { settings } = props;
  return {
    fields: ['parallaxEffect', 'backgroundImage'],
    defaultValues: {
      parallaxEffect: settings.parallaxEffect,
      backgroundImage: settings.backgroundImage,
    },
    validation: {},
  };
})(BackgroundSettings);
