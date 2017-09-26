import React, {
  Component,
} from 'react';

import _ from 'lodash';

import { View } from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import { rewardShape } from './shapes.js';
import Stamp from './Stamp';

const STAMPS_PER_ROW = 7;

const { bool, func, shape, string } = React.PropTypes;

const iconStyleShape = shape({
  color: string,
});

/**
 * Displays stamps required to redeem a reward for a punch card.
 * Stamps can be in the default state or punched.
 */
export class Stamps extends Component {
  static propTypes = {
    // Punch card reward description, with points and points required
    reward: rewardShape.isRequired,
    // Sets custom style to stamp icon
    iconStyle: iconStyleShape,
    // Called when a stamp is pressed
    onStamped: func,
  };

  constructor(props) {
    super(props);

    this.handleStampPress = this.handleStampPress.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  handleStampPress(stampIndex) {
    const { onStamped } = this.props;

    onStamped(stampIndex);
  }

  renderStamp(stampIndex) {
    const { onStamped, reward: { points }, iconStyle } = this.props;

    return (
      <Stamp
        iconStyle={iconStyle}
        isStamped={stampIndex < points}
        key={stampIndex}
        stampIndex={stampIndex}
        onPress={onStamped && this.handleStampPress}
      />
    );
  }

  renderRow(rowIndex) {
    const { reward: { pointsRequired } } = this.props;

    const stamps = _.times(STAMPS_PER_ROW, (index) => {
      const stampIndex = (rowIndex * STAMPS_PER_ROW) + index;

      return stampIndex < pointsRequired ? this.renderStamp(stampIndex) : null;
    });

    return (
      <View
        key={rowIndex}
        styleName="horizontal sm-gutter-vertical"
      >
        {stamps}
      </View>
    );
  }

  render() {
    const { reward: { pointsRequired } } = this.props;

    const rows = Math.ceil(pointsRequired / STAMPS_PER_ROW);

    return (
      <View styleName="vertical">
        {_.times(rows, this.renderRow)}
      </View>
    );
  }
}

Stamp.propTypes = {
  // Sets custom style to stamp icon
  iconStyle: iconStyleShape,
  // True if stamped, false otherwise
  isStamped: bool,
  // Called when a stamp is pressed
  onPress: func,
};

export default connectStyle(ext('Stamps'))(Stamps);
