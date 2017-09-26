import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  Image,
  Divider,
  Row,
  Subtitle,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

import {
  rewardShape,
 } from './shapes';

const { func } = React.PropTypes;

/**
 * Renders a single reward, in a list of rewards for places.
 */
export class RewardListView extends Component {
  static propTypes = {
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
    const { reward } = this.props;
    const { id, image, pointsRequired, title } = reward;

    return (
      <TouchableOpacity
        key={id}
        onPress={this.onPress}
      >
        <Row>
          <Image
            styleName="small placeholder"
            source={{ uri: image ? image.url : '' }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>{title}</Subtitle>
            <Subtitle>{`${pointsRequired} points`}</Subtitle>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('RewardListView'))(RewardListView);
