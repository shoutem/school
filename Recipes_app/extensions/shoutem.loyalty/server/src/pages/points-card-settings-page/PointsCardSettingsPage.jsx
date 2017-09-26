import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { navigateToExtension } from '../../redux';

export class PointsCardSettingsPage extends Component {
  constructor(props) {
    super(props);

    this.handleNavigateToLoyaltyClick = this.handleNavigateToLoyaltyClick.bind(this);
  }

  handleNavigateToLoyaltyClick() {
    const { appId, ownExtension } = this.props;
    const extensionId = _.get(ownExtension, 'id');
    this.props.navigateToExtension(appId, extensionId);
  }

  render() {
    return (
      <p className="points-card-settings-page">
        To configure your Loyalty program, please click{' '}
        <a onClick={this.handleNavigateToLoyaltyClick}>here</a>.
      </p>
    );
  }
}

PointsCardSettingsPage.propTypes = {
  appId: PropTypes.string,
  ownExtension: PropTypes.object,
  navigateToExtension: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    navigateToExtension: (appId, extensionId) => (
      dispatch(navigateToExtension(appId, extensionId))
    ),
  };
}

export default connect(null, mapDispatchToProps)(PointsCardSettingsPage);
