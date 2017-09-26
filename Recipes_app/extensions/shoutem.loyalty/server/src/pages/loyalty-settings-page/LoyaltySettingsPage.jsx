import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  fetchExtension,
  updateExtensionSettings,
  getExtensionState,
} from '@shoutem/redux-api-sdk';
import { isInitialized, shouldLoad, shouldRefresh } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import LoyaltyDisabledPlaceholder from '../../components/loyalty-disabled-placeholder';
import { CashierSettings } from '../../modules/cashiers';
import { RulesSettings } from '../../modules/rules';
import { CmsSelect, cmsApi } from '../../modules/cms';
import { loyaltyApi } from '../../services';
import {
  enableLoyalty,
  getLoyaltyPlaces,
  loadLoyaltyPlaces,
  PROGRAMS,
} from '../../redux';
import './style.scss';

const PLACES_DESCRIPTOR = {
  filterKeyProp: 'id',
  filterLabelProp: 'name',
};

class LoyaltySettingsPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.initializeApiEndpoints = this.initializeApiEndpoints.bind(this);
    this.handleUpdateExtension = this.handleUpdateExtension.bind(this);
    this.handlePlaceChange = this.handlePlaceChange.bind(this);
    this.handleEnableLoyalty = this.handleEnableLoyalty.bind(this);
    this.renderLoyaltySettings = this.renderLoyaltySettings.bind(this);

    const settings = _.get(props, 'ownExtension.settings', {});
    const { program, rules, requireReceiptCode } = settings;
    const programId = _.get(program, 'id', null);

    this.state = {
      programId,
      rules,
      requireReceiptCode,
      currentPlaceId: null,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const {
      appId: nextAppId,
      ownExtension: nextOwnExtension,
      places: nextPlaces,
    } = nextProps;

    const nextSettings = _.get(nextOwnExtension, 'settings', {});
    this.initializeApiEndpoints(nextSettings);

    if (shouldLoad(nextProps, props, 'ownExtension')) {
      this.props.fetchExtension();
    }

    if (cmsApi.isInitialized() && shouldRefresh(nextPlaces)) {
      this.props.loadPlaces(nextAppId);
    }
  }

  initializeApiEndpoints(nextSettings) {
    const { apiEndpoint, cmsEndpoint } = nextSettings;

    if (!loyaltyApi.isInitialized()) {
      loyaltyApi.init(apiEndpoint);
    }

    if (!cmsApi.isInitialized()) {
      cmsApi.init(cmsEndpoint);
    }
  }

  handleUpdateExtension(settingsPatch) {
    const { ownExtension } = this.props;
    return this.props.updateExtensionSettings(ownExtension, settingsPatch);
  }

  handlePlaceChange(placeId) {
    this.setState({ currentPlaceId: placeId });
  }

  handleEnableLoyalty() {
    const { rules } = this.state;

    return this.props.enableLoyalty(rules)
      .then(programId => {
        const program = {
          type: PROGRAMS,
          id: programId,
        };

        return Promise.all([programId, this.handleUpdateExtension({ program })]);
      }).then(([programId]) => this.setState({ programId }));
  }

  renderLoyaltySettings() {
    const {
      programId,
      requireReceiptCode,
      currentPlaceId,
      rules,
    } = this.state;
    const { appId, places, ownExtensionName } = this.props;

    return (
      <div>
        {!_.isEmpty(places) &&
          <CmsSelect
            allItemsLabel="All stores"
            descriptor={PLACES_DESCRIPTOR}
            dropdownLabel="Select a store"
            onFilterChange={this.handlePlaceChange}
            resources={places}
          />
        }
        <RulesSettings
          currentPlaceId={currentPlaceId}
          extensionName={ownExtensionName}
          onUpdateExtension={this.handleUpdateExtension}
          programId={programId}
          requireReceiptCode={requireReceiptCode}
          ruleTemplates={rules}
        />
        <CashierSettings
          appId={appId}
          currentPlaceId={currentPlaceId}
          extensionName={ownExtensionName}
          places={places}
          placesDescriptor={PLACES_DESCRIPTOR}
          programId={programId}
        />
      </div>
    );
  }

  render() {
    const { programId } = this.state;
    const { ownExtension, places } = this.props;
    const dataLoading = !isInitialized(ownExtension) || !isInitialized(places);

    return (
      <LoaderContainer
        className="loyalty-settings-page"
        isLoading={dataLoading}
      >
        {!programId &&
          <LoyaltyDisabledPlaceholder
            onEnableLoyaltyClick={this.handleEnableLoyalty}
          />
        }
        {programId && this.renderLoyaltySettings()}
      </LoaderContainer>
    );
  }
}

LoyaltySettingsPage.propTypes = {
  appId: PropTypes.string,
  ownExtension: PropTypes.object,
  fetchExtension: PropTypes.func,
  updateExtensionSettings: PropTypes.func,
  enableLoyalty: PropTypes.func,
  createAuthorization: PropTypes.func,
  places: PropTypes.array,
  loadPlaces: PropTypes.func,
  ownExtensionName: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  const { ownExtensionName } = ownProps;
  const extensionState = getExtensionState(state, ownExtensionName);
  return {
    places: getLoyaltyPlaces(extensionState, state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { ownExtensionName } = ownProps;
  const scope = { extensionName: ownExtensionName };

  return {
    fetchExtension: () => (
      dispatch(fetchExtension(ownExtensionName))
    ),
    updateExtensionSettings: (extension, settings) => (
      dispatch(updateExtensionSettings(extension, settings))
    ),
    enableLoyalty: (rules, authorizationTypes) => (
      dispatch(enableLoyalty(rules, authorizationTypes, scope))
    ),
    loadPlaces: (appId, categoryId) => (
      dispatch(loadLoyaltyPlaces(appId, categoryId, scope))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoyaltySettingsPage);
