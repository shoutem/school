import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Checkbox, ControlLabel, Button, ButtonToolbar } from 'react-bootstrap';
import _ from 'lodash';

import { ext } from 'context';
import { getExtensionInstallation, url, appId } from 'environment';

import {
  updateExtensionInstallationSettings,
} from './../reducer';
import { getExtensionInstallationSettings, mergeSettings } from './../../settings';

import './providers.scss';

export class Providers extends Component {
  constructor(props) {
    super(props);
    this.getExtensionInstallationSettings = this.getExtensionInstallationSettings.bind(this);
    this.setExtensionInstallationSettings = this.setExtensionInstallationSettings.bind(this);
    this.handleEmailEnabledChange = this.handleEmailEnabledChange.bind(this);
    this.handleAllowNewUserRegistrationChange = this.handleAllowNewUserRegistrationChange.bind(this);
    this.handleFacebookEnabledChange = this.handleFacebookEnabledChange.bind(this);
    this.handleFacebookAppIdChange = this.handleFacebookAppIdChange.bind(this);
    this.handleFacebookAppNameChange = this.handleFacebookAppNameChange.bind(this);
    this.handleFacebookSaveClick = this.handleFacebookSaveClick.bind(this);
    this.handleTwitterEnabledChange = this.handleTwitterEnabledChange.bind(this);
    this.handleTwitterConsumerKeyChange = this.handleTwitterConsumerKeyChange.bind(this);
    this.handleTwitterConsumerKeySecretChange = this.handleTwitterConsumerKeySecretChange.bind(this);
    this.handleTwitterSaveClick = this.handleTwitterSaveClick.bind(this);
    this.getTwitterSettingsBuilderUrl = this.getTwitterSettingsBuilderUrl.bind(this);

    const {
      providers: {
        facebook = {}, twitter = {},
      },
    } = getExtensionInstallationSettings(props.extensionInstallation);

    this.state = {
      facebookAppId: facebook.appId,
      facebookAppName: facebook.appName,
      twitterConsumerKey: twitter.consumerKey,
      twitterConsumerKeySecret: twitter.consumerKeySecret,
    };
  }

  getExtensionInstallationSettings() {
    return getExtensionInstallationSettings(this.props.extensionInstallation);
  }

  setExtensionInstallationSettings(settings) {
    const id = this.props.extensionInstallation.id;
    const currentSettings = this.getExtensionInstallationSettings();
    const mergedSettings = mergeSettings(currentSettings, settings);
    this.props.updateExtensionInstallationSettings(id, mergedSettings);
  }

  handleEmailEnabledChange(event) {
    if (!event.target) {
      return;
    }
    const enabled = event.target.checked;
    this.setExtensionInstallationSettings({
      signupEnabled: enabled,
      providers: {
        email: {
          enabled,
        },
      },
    });
  }

  handleAllowNewUserRegistrationChange(event) {
    if (!event.target) {
      return;
    }
    this.setExtensionInstallationSettings({ signupEnabled: event.target.checked });
  }

  handleFacebookEnabledChange(event) {
    if (!event.target) {
      return;
    }
    this.setExtensionInstallationSettings({
      providers: {
        facebook: {
          enabled: event.target.checked,
        },
      },
    });
  }

  handleFacebookAppIdChange(event) {
    if (!event.target) {
      return;
    }
    this.setState({ facebookAppId: event.target.value });
  }

  handleFacebookAppNameChange(event) {
    if (!event.target) {
      return;
    }
    this.setState({ facebookAppName: event.target.value });
  }

  handleFacebookSaveClick() {
    const { facebookAppId, facebookAppName } = this.state;
    if (facebookAppId && facebookAppName) {
      this.setExtensionInstallationSettings({
        providers: {
          facebook: {
            appId: facebookAppId,
            appName: facebookAppName,
          },
        },
      });
      this.setState({ facebookError: '' });
    } else {
      this.setState({ facebookError: 'Invalid Facebook credentials.' });
    }
  }

  handleTwitterEnabledChange(event) {
    if (event.target) {
      this.setExtensionInstallationSettings({
        providers: {
          twitter: {
            enabled: event.target.checked,
          },
        },
      });
    }
  }

  handleTwitterConsumerKeyChange(event) {
    if (!event.target) {
      return;
    }
    this.setState({ twitterConsumerKey: event.target.value });
  }

  handleTwitterConsumerKeySecretChange(event) {
    if (!event.target) {
      return;
    }
    this.setState({ twitterConsumerKeySecret: event.target.value });
  }

  handleTwitterSaveClick() {
    const { twitterConsumerKey, twitterConsumerKeySecret } = this.state;
    if (twitterConsumerKey && twitterConsumerKeySecret) {
      this.setExtensionInstallationSettings({
        providers: {
          twitter: {
            consumerKey: twitterConsumerKey,
            consumerKeySecret: twitterConsumerKeySecret,
          },
        },
      });
      this.setState({ twitterError: '' });
    } else {
      this.setState({ twitterError: 'Invalid Twitter credentials.' });
    }
  }

  getTwitterSettingsBuilderUrl() {
    return `//${url.homepage}/builder/settings/sharing/twitter?nid=${appId}`;
  }

  render() {
    const settings = this.getExtensionInstallationSettings();
    const signupEnabled = _.get(settings, 'signupEnabled', false);
    const emailEnabled = _.get(settings, 'providers.email.enabled', false);
    const facebookEnabled = _.get(settings, 'providers.facebook.enabled', false);
    const twitterEnabled = _.get(settings, 'providers.twitter.enabled', false);

    const {
      facebookAppId,
      facebookAppName,
      twitterConsumerKey,
      twitterConsumerKeySecret,
      facebookError,
      twitterError,
    } = this.state;

    return (
      <div>
        <form>
          <FormGroup>
            <h3>Select authentication providers</h3>
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <Checkbox
                      checked={emailEnabled}
                      onChange={this.handleEmailEnabledChange}
                    >
                      Email and password
                    </Checkbox>
                  </td>
                </tr>
                {emailEnabled && (
                <tr>
                  <td>
                    <h3>Email and password settings</h3>
                    <Checkbox
                      checked={signupEnabled}
                      onChange={this.handleAllowNewUserRegistrationChange}
                    >
                      Allow new user registration
                    </Checkbox>
                  </td>
                </tr>
                )}
                <tr>
                  <td>
                    <Checkbox
                      checked={facebookEnabled}
                      onChange={this.handleFacebookEnabledChange}
                    >
                      Facebook
                    </Checkbox>
                  </td>
                </tr>
                {facebookEnabled && (
                <tr>
                  <td>
                    <h3>Facebook login setup</h3>
                    <ControlLabel>App ID</ControlLabel>
                    <input
                      type="text"
                      className="form-control"
                      value={facebookAppId}
                      onChange={this.handleFacebookAppIdChange}
                    />
                    <ControlLabel>App Name</ControlLabel>
                    <input
                      type="text"
                      className="form-control"
                      value={facebookAppName}
                      onChange={this.handleFacebookAppNameChange}
                    />
                    {facebookError && (
                      <ControlLabel>{facebookError}</ControlLabel>
                    )}
                    <ButtonToolbar>
                      <Button
                        bsStyle="primary"
                        onClick={this.handleFacebookSaveClick}
                      >
                        Save
                      </Button>
                    </ButtonToolbar>
                  </td>
                </tr>
                )}
                <tr>
                  <td>
                    <Checkbox
                      checked={twitterEnabled}
                      onChange={this.handleTwitterEnabledChange}
                    >
                      Twitter
                    </Checkbox>
                  </td>
                </tr>
                {twitterEnabled && (
                <tr>
                  <td>
                    <h3>Twitter login setup</h3>
                    <div>
                      <ControlLabel>
                        Make sure you’ve configured your Twitter app under application <a href={this.getTwitterSettingsBuilderUrl()}>Settings</a>
                      </ControlLabel>
                    </div>
                    <ControlLabel>Consumer Key</ControlLabel>
                    <input
                      type="text"
                      className="form-control"
                      value={twitterConsumerKey}
                      onChange={this.handleTwitterConsumerKeyChange}
                    />
                    <ControlLabel>Consumer Key Secret</ControlLabel>
                    <input
                      type="text"
                      className="form-control"
                      value={twitterConsumerKeySecret}
                      onChange={this.handleTwitterConsumerKeySecretChange}
                    />
                    {twitterError && (
                      <ControlLabel>{twitterError}</ControlLabel>
                    )}
                    <ButtonToolbar>
                      <Button
                        bsStyle="primary"
                        onClick={this.handleTwitterSaveClick}
                      >
                        Save
                      </Button>
                    </ButtonToolbar>
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </FormGroup>
        </form>
      </div>
    );
  }
}

function mapStateToProps() {
  return {
    extensionInstallation: getExtensionInstallation(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExtensionInstallationSettings: (id, settings) => dispatch(updateExtensionInstallationSettings(id, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Providers);
