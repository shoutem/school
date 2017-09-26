import React from 'react';
import { connect } from 'react-redux';

import {
  closeModal,
  navigateBack,
  openInModal,
} from '@shoutem/core/navigation';

import {
  Button,
  Caption,
  Image,
  Html,
  Screen,
  ScrollView,
  Tile,
  Title,
  Text,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';
import {
  getCardStateForPlace,
  isPunchCard,
 } from '../redux';

import {
  cardStateShape,
  rewardShape,
} from '../components/shapes';
import Stamps from '../components/Stamps';

import RewardProgressBar from '../components/RewardProgressBar';

const { func } = React.PropTypes;

/**
 * Shows details for a reward or a punch card.
 * If the user's loyalty card has enough points, he can see an option to redeem the reward.
 * A reward can belong to a place or to a single card, not related to a place.
 */
export class RewardDetailsScreen extends React.Component {
  static propTypes = {
    // User's loyalty card state
    cardState: cardStateShape,
    // Reward description
    reward: rewardShape.isRequired,
    // Opens the redeem reward or stamp a punch card flow in a new modal screen
    openInModal: func,
    // Navigates back to list of rewards when the redeem or stamp flow starts
    navigateBack: func,
  };

  constructor(props) {
    super(props);

    this.handleAction = this.handleAction.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getNavBarProps() {
    return {
      styleName: 'clear',
      animationName: 'solidify',
    };
  }

  handleAction(redeem) {
    const { reward, navigateBack, openInModal } = this.props;

    navigateBack();
    openInModal({
      screen: ext('VerificationScreen'),
      props: {
        reward,
        redeem,
      },
    });
  }

  renderImage() {
    const { reward } = this.props;
    const { image } = reward;

    return (
      <Image
        source={{ uri: image && image.url }}
        styleName="large placeholder"
        animationName="hero"
      />
    );
  }

  renderSummary() {
    const { cardState: { points = 0 }, reward } = this.props;
    const { pointsRequired, title } = reward;

    return (
      <Tile>
        <View styleName="content vertical">
          <Title styleName="h-center xl-gutter-top md-gutter-bottom">{title}</Title>
          {isPunchCard(reward) ?
            <View styleName="vertical h-center">
              <Stamps reward={reward} />
            </View>
            :
            <View>
              <Caption styleName="h-center md-gutter-bottom">
                {`Requires ${pointsRequired} points`}
              </Caption>
              <RewardProgressBar
                points={points}
                pointsRequired={pointsRequired}
              />
            </View>
          }
          {this.renderActionButton()}
        </View>
      </Tile>
    );
  }

  renderActionButton() {
    const { cardState: { points: cardPoints = 0 }, reward } = this.props;
    const { points = 0, pointsRequired } = reward;

    if (!isPunchCard(reward) && cardPoints < pointsRequired) {
      return null;
    }

    const shouldRedeem = !isPunchCard(reward) || points >= pointsRequired;

    return (
      <View styleName="h-center vertical">
        <Button
          styleName="secondary md-gutter"
          onPress={() => this.handleAction(shouldRedeem)}
        >
          <Text>{shouldRedeem ? 'REDEEM' : 'STAMP CARD'}</Text>
        </Button>
      </View>
    );
  }

  render() {
    const { reward } = this.props;
    const { description } = reward;

    return (
      <Screen styleName="full-screen paper">
        <NavigationBar {...this.getNavBarProps()} />
        <ScrollView>
          {this.renderImage()}
          {this.renderSummary()}
          <View styleName="md-gutter-horizontal">
            {description ? <Html body={description} /> : null}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { place } = ownProps;
  const placeId = place ? place.id : null;

  return {
    cardState: getCardStateForPlace(state, placeId) || {},
  };
};

export default connect(mapStateToProps, { closeModal, navigateBack, openInModal })(
  connectStyle(ext('RewardDetailsScreen'))(RewardDetailsScreen),
);
