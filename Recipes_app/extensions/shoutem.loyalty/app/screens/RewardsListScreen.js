import React from 'react';

import _ from 'lodash';
import { connect } from 'react-redux';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';

import {
  EmptyStateView,
} from '@shoutem/ui-addons';

import {
  find,
  getCollection,
  next,
  shouldRefresh,
} from '@shoutem/redux-io';

import {
  getAppId,
  getExtensionSettings,
  ListScreen,
} from 'shoutem.application';

import {
  getUser,
  loginRequired,
} from 'shoutem.auth';

import {
  REWARDS_SCHEMA,
  CARD_STATE_SCHEMA,
  POINT_REWARDS_SCHEMA,
  ext,
} from '../const';

import { refreshCard } from '../services';

import NoProgramScreen from './NoProgramScreen';
import RewardListView from '../components/RewardListView';

const { func, number, shape, string } = React.PropTypes;

/**
 * Displays a list of rewards.
 * The user can redeem a reward once he collects the required number of points on his loyalty card.
 */
export class RewardsListScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
    // Loyalty card for user
    card: shape({
      // Card ID
      id: string,
    }),
    // Parent category ID in Shoutem CMS
    parentCategoryId: string,
    // ID of loyalty program for this extension
    programId: string,
    // Currently logged in user
    user: shape({
      id: number,
    }),

    // Actions
    find: func,
    navigateTo: func,
    next: func,
    // Refreshes the loyalty card
    refreshCard: func,
  };

  constructor(props, context) {
    super(props, context);

    this.renderRow = this.renderRow.bind(this);
    this.navigateToRewardDetails = this.navigateToRewardDetails.bind(this);

    this.state = {
      cmsSchema: REWARDS_SCHEMA,
      schema: POINT_REWARDS_SCHEMA,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { card: { id } } = this.props;
    const { card: { id: nextId }, data } = nextProps;

    const hasNewCardId = !id && nextId;

    if (hasNewCardId || (nextId && shouldRefresh(data))) {
      this.fetchData(nextId);
    }
  }

  fetchData(newCardId) {
    const { card, find, parentCategoryId, refreshCard } = this.props;
    const { cmsSchema, schema } = this.state;

    const cardId = card.id || newCardId;

    if (!cardId) {
      refreshCard();
      return;
    }

    find(schema, undefined, {
      'filter[app]': getAppId(),
      'filter[schema]': cmsSchema,
      'filter[category]': parentCategoryId,
      'filter[card]': cardId,
    });

    find(CARD_STATE_SCHEMA, undefined, {
      cardId,
    });
  }

  navigateToRewardDetails(reward) {
    const { navigateTo, parentCategoryId } = this.props;

    navigateTo({
      screen: ext('RewardDetailsScreen'),
      props: {
        reward: { ...reward, parentCategoryId },
      },
    });
  }

  renderRow(reward) {
    return (
      <RewardListView
        key={reward.id}
        onPress={this.navigateToRewardDetails}
        reward={reward}
      />
    );
  }

  renderPlaceholderView() {
    const { data, parentCategoryId } = this.props;

    // If collection doesn't exist (`parentCategoryId` is undefined), notify user to create
    // content and reload app, because `parentCategoryId` is retrieved through app configuration
    if (_.isUndefined(parentCategoryId)) {
      return (
        <EmptyStateView
          icon="error"
          message="Please create content and reload your app."
        />
      );
    }

    return super.renderPlaceholderView(data);
  }

  shouldRenderPlaceholderView() {
    const { parentCategoryId, data } = this.props;

    return _.isUndefined(parentCategoryId) || super.shouldRenderPlaceholderView(data);
  }

  render() {
    const { programId } = this.props;

    return programId ? super.render() : (<NoProgramScreen />);
  }
}

export const mapStateToProps = (state, ownProps) => {
  const parentCategoryId = _.get(ownProps, 'shortcut.settings.parentCategory.id');
  const { allPointRewards, card: { data = {} } } = state[ext()];

  const extensionSettings = getExtensionSettings(state, ext());
  const programId = _.get(extensionSettings, 'program.id');

  return {
    card: data,
    parentCategoryId,
    programId,
    data: getCollection(allPointRewards, state),
    user: getUser(state),
  };
};

export const mapDispatchToProps = { find, navigateTo, next, refreshCard };

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('RewardsListScreen'))(RewardsListScreen),
));
