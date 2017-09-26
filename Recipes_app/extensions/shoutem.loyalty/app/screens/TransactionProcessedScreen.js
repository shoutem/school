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

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';
import { closeModal } from '@shoutem/core/navigation';

import { ext } from '../const';

const { bool, func, number } = React.PropTypes;

const STAMP_ICON = require('../assets/icons/stamp.png');
const TROPHY_ICON = require('../assets/icons/trophy.png');

const getNavBarProps = () => ({
  renderLeftComponent: () => null,
  title: 'CONGRATULATIONS',
});

/**
 * Informs the user about a successfully processed transaction.
 * Tells him how much points he received on his punch card or if he redeemed a reward.
 */
export class TransactionProcessedScreen extends React.Component {
  static propTypes = {
    // Points assigned in transaction
    points: number,
    // Whether the transaction redeemed a reward
    redeemed: bool,
    // Closes modal dialog in which the stamp card flow was started
    closeModal: func,
  };

  constructor(props) {
    super(props);

    this.handleContinue = this.handleContinue.bind(this);
  }

  handleContinue() {
    const { closeModal } = this.props;

    closeModal();
  }

  render() {
    const { points, redeemed } = this.props;

    const message = redeemed ?
      'You have redeemed your reward!' : `Your card was stamped ${points} times`;

    return (
      <Screen>
        <NavigationBar {...getNavBarProps()} />
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <View styleName="oval-highlight">
            <Image
              source={redeemed ? TROPHY_ICON : STAMP_ICON}
              styleName="small-avatar"
            />
          </View>
          <Subtitle styleName="h-center md-gutter-top xl-gutter-horizontal">{message}</Subtitle>
          <Button
            styleName="secondary lg-gutter-vertical"
            onPress={this.handleContinue}
          >
            <Text>CONTINUE</Text>
          </Button>
        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { closeModal })(
  connectStyle(ext('TransactionProcessedScreen'))(TransactionProcessedScreen),
);
