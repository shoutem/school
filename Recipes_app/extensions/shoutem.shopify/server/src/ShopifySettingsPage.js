import React, {
  Component,
  PropTypes,
} from 'react';

import {
  Button,
  ButtonToolbar,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';

import { connect } from 'react-redux';
import validator from 'validator';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getExtensionInstallation } from 'environment';

import {
  getExtensionSettings,
  updateExtensionSettings,
} from './builder-sdk';

import { validateShopifySettings } from './actions';

const secureProtocolRegex = /^https?:\/\//i;

const ERROR_STORE_URL = 'Invalid store URL';
const ERROR_SHOP = 'We can\'t reach the shop. Please check your store URL and API key.';

/**
 * A helper function that removes http or https protocol from the store URL.
 * This is used only for situations where a user accidentally copies his entire
 * Shopify store URL and not just the domain (somestore.myshopify.com)
 */
const removeProtocolFromURL = url => url.replace(secureProtocolRegex, '');

class ShopifySettingsPage extends Component {
  constructor(props) {
    super(props);

    this.handleApiKeyTextChange = this.handleApiKeyTextChange.bind(this);
    this.handleStoreTextChange = this.handleStoreTextChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      error: '',
      ...getExtensionSettings(props.extensionInstallation),
      hasChanges: false,
    };
  }

  handleStoreTextChange(event) {
    this.setState({
      hasChanges: true,
      store: event.target.value,
    });
  }

  handleApiKeyTextChange(event) {
    this.setState({
      apiKey: event.target.value,
      hasChanges: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSave();
  }

  handleSave() {
    const { extensionInstallation, validateShopifySettings, updateSettings } = this.props;
    const { store, apiKey } = this.state;

    if (!validator.isURL(store)) {
      this.setState({ error: ERROR_STORE_URL });
      return;
    }

    const domain = removeProtocolFromURL(store);

    this.setState({
      error: '',
      inProgress: true,
      store: domain,
    });

    validateShopifySettings(domain, apiKey).then(() => {
      updateSettings(extensionInstallation, { store: domain, apiKey });

      this.setState({
        hasChanges: false,
        inProgress: false,
      });
    }).catch(() => {
      this.setState({
        error: ERROR_SHOP,
        inProgress: false,
      });
    });
  }

  render() {
    const { error, hasChanges, inProgress, store, apiKey } = this.state;

    return (
      <div className="shopify-settings-page">
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h3>General settings</h3>
            <ControlLabel>Store URL (e.g. mystore.myshopify.com)</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={store}
              onChange={this.handleStoreTextChange}
            />
            <ControlLabel>Your API key for mobile sales channel</ControlLabel>
            <FormControl
              type="text"
              className="form-control"
              value={apiKey}
              onChange={this.handleApiKeyTextChange}
            />
            <ControlLabel>
              This extension will use the same Shopify store for all screens in the app
            </ControlLabel>
          </FormGroup>
          <HelpBlock className="text-error">
            {error}
          </HelpBlock>
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

const { func, shape, string } = PropTypes;

ShopifySettingsPage.propTypes = {
  extensionInstallation: shape({
    settings: shape({
      store: string,
      apiKey: string,
    }),
  }),
  validateShopifySettings: func,
  updateSettings: func,
};

function mapStateToProps() {
  return {
    extensionInstallation: getExtensionInstallation(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    validateShopifySettings: (store, apiKey) => dispatch(validateShopifySettings(store, apiKey)),
    updateSettings: (extension, settings) => dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopifySettingsPage);
