import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { shouldLoad, isInitialized } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import _ from 'lodash';
import {
  fetchShortcut,
  fetchExtension,
} from '@shoutem/redux-api-sdk';
import { cmsApi } from '../../modules/cms';
import { PlaceRewards } from '../../modules/rewards';
import './style.scss';

const PLACES_DESCRIPTOR = {
  categoryIdSelector: 'parentCategory.id',
  filterKeyProp: 'id',
  filterLabelProp: 'name',
};

const REWARDS_DESCRIPTOR = {
  categoryIdSelector: 'cmsCategory.id',
  columns: [
    {
      header: 'Title',
      value: 'title',
      required: true,
    },
    {
      header: 'Points',
      value: 'pointsRequired',
    },
    {
      header: 'Store',
      value: 'place.name',
    },
  ],
};

export class RewardsPage extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);

    this.state = {
      rewardsCategoryId: null,
      placesCategoryId: null,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { ownExtension } = nextProps;

    if (shouldLoad(nextProps, props, 'shortcut')) {
      this.props.fetchShortcut();
    }

    if (shouldLoad(nextProps, props, 'ownExtension')) {
      this.props.fetchExtension();
    }

    const cmsEndpoint = _.get(ownExtension, 'settings.cmsEndpoint');
    if (!cmsApi.isInitialized()) {
      cmsApi.init(cmsEndpoint);
    }
  }

  render() {
    const {
      appId,
      shortcut,
      shortcutId,
      ownExtensionName,
    } = this.props;

    const settings = _.get(shortcut, 'settings');
    const rewardsCategoryId = _.get(settings, REWARDS_DESCRIPTOR.categoryIdSelector);
    const placesCategoryId = _.get(settings, PLACES_DESCRIPTOR.categoryIdSelector);

    return (
      <LoaderContainer
        className="rewards-settings-page"
        isLoading={!isInitialized(shortcut)}
      >
        <PlaceRewards
          appId={appId}
          extensionName={ownExtensionName}
          newCategoryName="Rewards"
          placesCategoryId={placesCategoryId}
          placesDescriptor={PLACES_DESCRIPTOR}
          rewardsCategoryId={rewardsCategoryId}
          rewardsDescriptor={REWARDS_DESCRIPTOR}
          shortcut={shortcut}
          shortcutId={shortcutId}
        />
      </LoaderContainer>
    );
  }
}

RewardsPage.propTypes = {
  appId: PropTypes.string,
  shortcut: PropTypes.object,
  ownExtension: PropTypes.object,
  fetchShortcut: PropTypes.func,
  fetchExtension: PropTypes.func,
  updateRewardsCategoryId: PropTypes.func,
  shortcutId: PropTypes.string,
  ownExtensionName: PropTypes.string,
};

function mapDispatchToProps(dispatch, ownProps) {
  const { shortcutId, ownExtensionName } = ownProps;

  return {
    fetchShortcut: () => (
      dispatch(fetchShortcut(shortcutId))
    ),
    fetchExtension: () => (
      dispatch(fetchExtension(ownExtensionName))
    ),
  };
}

export default connect(null, mapDispatchToProps)(RewardsPage);
