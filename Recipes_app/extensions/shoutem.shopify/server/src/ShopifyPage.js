import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormGroup, Checkbox } from 'react-bootstrap';
import _ from 'lodash';
import { getExtensionInstallation, getShortcut } from 'environment';
import { ext } from 'context';
import { loadCollections } from './actions';

import {
  getExtensionSettings,
  updateShortcutSettings,
} from './builder-sdk';

import ShopPreview from './components/ShopPreview';

import ShopifySettingsPage from './ShopifySettingsPage';

class ShopifyPage extends Component {
  constructor(props) {
    super(props);

    this.handleCollectionSelection = this.handleCollectionSelection.bind(this);
    this.renderCollection = this.renderCollection.bind(this);
  }

  componentDidMount() {
    const { store, apiKey } = getExtensionSettings(this.props.extensionInstallation);

    if (store && apiKey) {
      this.props.loadCollections(store, apiKey);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { extensionInstallation, loadCollections } = this.props;
    const { store, apiKey } = getExtensionSettings(extensionInstallation);
    const {
      store: nextStore,
      apiKey: nextApiKey,
    } = getExtensionSettings(nextProps.extensionInstallation);

    if (!nextStore || !nextApiKey) {
      return;
    }

    if (nextStore !== store || nextApiKey !== apiKey) {
      loadCollections();
    }
  }

  getShortcutSettings() {
    const { shortcut } = this.props;

    if (!shortcut || !shortcut.settings) {
      return { selectedCollections: [] };
    }

    return shortcut.settings;
  }

  handleCollectionSelection(event) {
    if (!event.target) {
      return;
    }

    const { shortcut, updateShortcutSettings } = this.props;
    const { selectedCollections } = this.getShortcutSettings();
    const { checked } = event.target;

    const id = parseInt(event.target.id, 10);

    const newSelectedCollections = checked ? _.union(selectedCollections, [id]) :
      _.without(selectedCollections, id);

    updateShortcutSettings(shortcut, { selectedCollections: newSelectedCollections });
  }

  renderCollection(collection) {
    const { collection_id: id, title } = collection;
    const { selectedCollections } = this.getShortcutSettings();

    return (
      <Checkbox
        id={id}
        checked={_.includes(selectedCollections, id)}
        onChange={this.handleCollectionSelection}
      >
        {title}
      </Checkbox>
    );
  }

  render() {
    const { store, apiKey } = getExtensionSettings(this.props.extensionInstallation);
    const { collections = [] } = this.props;

    if (!(store && apiKey)) {
      return <ShopifySettingsPage />;
    }

    return (
      <div className="shopify-page">
        <ShopPreview store={store} />
        <form className="voffset4">
          <FormGroup>
            <h4>Store collections</h4>
            {collections.map(this.renderCollection)}
          </FormGroup>
        </form>
      </div>
    );
  }
}

const { arrayOf, func, number, shape, string } = PropTypes;

ShopifyPage.propTypes = {
  collections: arrayOf(shape({
    id: number,
    title: string,
  })),
  extensionInstallation: shape({
    settings: shape({
      store: string,
      apiKey: string,
    }),
  }),
  loadCollections: func,
  shortcut: shape({
    id: number,
    settings: shape({
      selectedCollections: arrayOf(number),
    }),
  }),
  updateShortcutSettings: func,
};

function mapStateToProps(state) {
  return {
    collections: state[ext()].collections.collection_listings || [],
    extensionInstallation: getExtensionInstallation(),
    shortcut: getShortcut(),
  };
}

const mapDispatchToProps = { loadCollections, updateShortcutSettings };

export default connect(mapStateToProps, mapDispatchToProps)(ShopifyPage);
