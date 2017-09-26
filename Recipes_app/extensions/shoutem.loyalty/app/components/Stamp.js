import React, {
  Component,
} from 'react';

import {
  Icon,
  TouchableOpacity,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

const { bool, func, number, shape, string } = React.PropTypes;

const iconStyleShape = shape({
  color: string,
});

/**
 * Displays stamps required to redeem a reward for a punch card.
 * Stamps can be in the default state or punched.
 */
export class Stamp extends Component {
  static propTypes = {
    // Sets custom style to stamp icon
    iconStyle: iconStyleShape,
    // True if stamped, false otherwise
    isStamped: bool,
    // Stamp index
    stampIndex: number,
    // Called when a stamp is pressed
    onPress: func,
  };

  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress() {
    const { onPress, stampIndex } = this.props;

    onPress(stampIndex);
  }

  renderStampIcon() {
    const { iconStyle, isStamped } = this.props;

    return (
      <Icon
        name={`checkbox-${isStamped ? 'on' : 'off'}`}
        styleName="md-gutter-right"
        style={{ ...iconStyle, marginRight: 15 }}
      />
    );
  }

  render() {
    const { onPress } = this.props;

    return onPress ?
      <TouchableOpacity
        onPress={this.handlePress}
      >
        {this.renderStampIcon()}
      </TouchableOpacity>
      :
      this.renderStampIcon();
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

export default connectStyle(ext('Stamp'))(Stamp);
