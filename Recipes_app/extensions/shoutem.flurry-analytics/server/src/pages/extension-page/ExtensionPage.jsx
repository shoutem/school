import React, { Component, PropTypes } from 'react';
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { fetchExtension, updateExtensionSettings, getExtension } from '@shoutem/redux-api-sdk';
import { shouldRefresh } from '@shoutem/redux-io';
import { connect } from 'react-redux';
import './style.scss';

class ExtensionPage extends Component {
  static propTypes = {
    extension: PropTypes.object,
    updateExtensionSettings: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.initializeApiKeysFromExtensionSettings = this.initializeApiKeysFromExtensionSettings.bind(this);

    this.state = {
      error: null,
      ios: {
        apiKey: this.getDevicePlatformApiKey('ios', props.extension),
      },
      android: {
        apiKey: this.getDevicePlatformApiKey('android', props.extension),
      },
      // flag indicating if value in input field is changed
      hasChanges: false,
    };
  }

  getDevicePlatformApiKey(platform, extension) {
    return _.get(extension, ['settings', platform, 'apiKey']);
  }

  initializeApiKeysFromExtensionSettings(platform, extension) {
    const apiKey = _.get(this.state, [platform, 'apiKey']);
    if (_.isEmpty(apiKey)) {
      this.setState({
        [platform]: {
          apiKey: this.getDevicePlatformApiKey(platform, extension),
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { extension: nextExtension } = nextProps;
    this.initializeApiKeysFromExtensionSettings('ios', nextExtension);
    this.initializeApiKeysFromExtensionSettings('android', nextExtension);
  }

  handleTextChange(event) {
    const keyName = event.target.name;
    const newState = _.set({}, keyName, event.target.value);
    this.setState({
      ...newState,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { extension } = this.props;
    const { ios, android } = this.state;
    const extensionSettings = {
      ios,
      android,
    };

    this.setState({ error: '', inProgress: true });
    this.props.updateExtensionSettings(extension, extensionSettings)
      .then(() => (
        this.setState({ hasChanges: false, inProgress: false })
      )).catch((err) => {
        this.setState({ error: err, inProgress: false });
      });
  }

  render() {
    const {
      error,
      hasChanges,
      inProgress,
      ios,
      android
    } = this.state;

    return (
      <div className="hello-extension-settings-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>Flurry API keys</h3>
            <ControlLabel>iPhone:</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              name="ios.apiKey"
              value={ios.apiKey}
              onChange={this.handleTextChange}
            />
            <ControlLabel>Android:</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              name="android.apiKey"
              value={android.apiKey}
              onChange={this.handleTextChange}
            />
          </FormGroup>
          {error &&
            <HelpBlock className="text-error">{error}</HelpBlock>
          }
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!hasChanges}
            onClick={this.handleSave}
          >
            <LoaderContainer isLoading={inProgress}>
              Save
            </LoaderContainer>
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    updateExtensionSettings: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
  };
}

export default connect(null, mapDispatchToProps)(ExtensionPage);

