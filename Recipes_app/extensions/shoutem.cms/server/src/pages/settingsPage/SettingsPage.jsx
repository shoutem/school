import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getExtensionInstallation } from 'environment';
import {
  getExtensionSettings,
  updateExtensionSettings,
} from '../../builder-sdk';
import './style.scss';

const resolveApiEndpoint = extensionInstallation => {
  if (!extensionInstallation) {
    return null;
  }
  const settings = getExtensionSettings(extensionInstallation);
  return settings.apiEndpoint;
};

export class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.updateApiEndpoint = this.updateApiEndpoint.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      apiEndpoint: resolveApiEndpoint(props.extensionInstallation),
    };
  }

  updateApiEndpoint(event) {
    event.preventDefault();

    const { extensionInstallation, updateSettings } = this.props;
    const { apiEndpoint } = this.state;
    updateSettings(extensionInstallation, { apiEndpoint });
  }

  handleInputChange(event) {
    const apiEndpoint = event.target.value;
    this.setState({ apiEndpoint });
  }

  render() {
    const { extensionInstallation } = this.props;
    const { apiEndpoint } = this.state;
    const endpointHasChanged = apiEndpoint !== resolveApiEndpoint(extensionInstallation);

    return (
      <div className="cms-settings-page">
        <h3>CMS settings</h3>
        <form onSubmit={this.updateApiEndpoint}>
          <FormGroup>
            <ControlLabel>Api endpoint</ControlLabel>
            <input
              defaultValue={this.state.apiEndpoint}
              className="form-control"
              type="text"
              autoFocus
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <Button
            disabled={!endpointHasChanged}
            bsStyle="primary"
            onClick={this.updateApiEndpoint}
          >
            Save
          </Button>
        </form>
      </div>
    );
  }
}

SettingsPage.propTypes = {
  extensionInstallation: PropTypes.object,
  updateSettings: PropTypes.func,
};

function mapStateToProps() {
  return {
    extensionInstallation: getExtensionInstallation(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSettings: (extension, settings) => dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
