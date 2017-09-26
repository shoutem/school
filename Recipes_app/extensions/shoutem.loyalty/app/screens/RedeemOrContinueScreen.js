import React from 'react';

import { connect } from 'react-redux';

import {
  Button,
  Image,
  Screen,
  Subtitle,
  Text,
  View,
} from '@shoutem/ui';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';
import { redeemReward } from '../services';
import { authorizationShape, rewardShape } from '../components/shapes';

const { func, number } = React.PropTypes;

const STAMP_ICON = require('../assets/icons/stamp.png');

/**
 * Lets the user choose if he wants to redeem his reward immediately or not.
 * This screen is shown when the user was awarded enough points on his punch card
 * to be able to redeem a reward.
 */
export class RedeemOrContinueScreen extends React.Component {
  static propTypes = {
    // Navigates to transaction processed screen
    navigateTo: func,
    // An already verified authorization,
    authorization: authorizationShape,
    // Points assigned in transaction
    points: number,
    // Reward that can be redeemed
    reward: rewardShape,
    // Redeems the reward
    redeemReward: func,
  };

  constructor(props) {
    super(props);

    this.handleRedeemLater = this.handleRedeemLater.bind(this);
    this.handleRedeemNow = this.handleRedeemNow.bind(this);
  }

  handleRedeemLater() {
    const { navigateTo, points } = this.props;

    navigateTo({
      screen: ext('TransactionProcessedScreen'),
      props: {
        points,
      },
    });
  }

  handleRedeemNow() {
    const { pointsRequired } = this.props.reward;

    this.processTransaction(-pointsRequired);
  }

  processTransaction(points) {
    const { redeemReward, authorization, reward } = this.props;

    redeemReward({ points }, authorization, reward);
  }

  render() {
    return (
      <Screen>
        <NavigationBar title="REDEEM REWARD" />
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <View styleName="oval-highlight">
            <Image
              source={STAMP_ICON}
              styleName="small-avatar"
            />
          </View>
          <Subtitle styleName="h-center md-gutter-top xl-gutter-horizontal">
            Your reward can be redeemed.
          </Subtitle>
          <View styleName="h-center horizontal lg-gutter-vertical">
            <Button onPress={this.handleRedeemLater}>
              <Text>REDEEM LATER</Text>
            </Button>
            <Button
              styleName="secondary md-gutter-left"
              onPress={this.handleRedeemNow}
            >
              <Text>REDEEM NOW</Text>
            </Button>
          </View>
        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { redeemReward, navigateTo })(
  connectStyle(ext('RedeemOrContinueScreen'))(RedeemOrContinueScreen),
);
