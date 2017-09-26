import React, {
  Component,
} from 'react';

import {
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

const { number } = React.PropTypes;

/**
 * Shows progress towards a reward
 */
class RewardProgressBar extends Component {
  static propTypes = {
    // Number of points
    points: number,
    // Points needed to redeem a reward
    pointsRequired: number,
  };

  render() {
    const { points, pointsRequired } = this.props;
    const progressPercentage = 100 * (points / pointsRequired);

    return (
      <View
        styleName="horizontal flexible"
        style={{
          height: 5,
          borderRadius: 100,
          backgroundColor: '#cbcbcb',
        }}
      >
        <View
          style={{
            borderRadius: 100,
            flex: progressPercentage,
            height: 5,
            backgroundColor: '#222222',
          }}
        />
        <View
          style={{
            flex: 100 - progressPercentage,
          }}
        />
      </View>
    );
  }
}

export default connectStyle(ext('RewardProgressBar'))(RewardProgressBar);
