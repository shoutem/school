import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  Caption,
  Icon,
  Image,
  Divider,
  Row,
  Subtitle,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

import {
  placeShape,
  rewardShape,
 } from './shapes';

import RewardProgressBar from './RewardProgressBar';

const { func } = React.PropTypes;

/**
 * Renders a single reward, in a list of rewards for places.
 */
export class PlaceRewardListView extends Component {
  static propTypes = {
    // The place to which this reward belongs
    place: placeShape.isRequired,
    // The reward
    reward: rewardShape.isRequired,
    // Called when reward is pressed
    onPress: func,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.reward);
  }

  render() {
    const { place: { points }, reward } = this.props;
    const { image, pointsRequired, title } = reward;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Row>
          <Image
            styleName="small rounded-corners placeholder"
            source={image ? { uri: image.url } : ''}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{title}</Subtitle>
            <Caption>{`Requires ${pointsRequired} points`}</Caption>
          </View>
          <Icon styleName="disclosure" name="right-arrow" />
        </Row>
        <Row>
          <RewardProgressBar
            points={points}
            pointsRequired={pointsRequired}
          />
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('PlaceRewardListView'))(PlaceRewardListView);
