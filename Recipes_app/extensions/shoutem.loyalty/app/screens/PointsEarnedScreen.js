import React from 'react';

import { connect } from 'react-redux';

import {
  Button,
  Screen,
  Subtitle,
  Text,
  Title,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';
import { closeModal } from '@shoutem/core/navigation';

import { ext } from '../const';

const { func, number, shape } = React.PropTypes;

/**
 * Informs the user about his transaction details and how much points he was awarded.
 */
export class PointsEarnedScreen extends React.Component {
  static propTypes = {
    // Transaction details
    data: shape({
      // Amount spent
      amount: number,
    }),
    // Points earned
    points: number,
    // Closes modal dialog in which the assign points flow was started
    closeModal: func,
  };

  constructor(props) {
    super(props);

    this.handleConfirm = this.handleConfirm.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getNavBarProps() {
    return {
      renderLeftComponent: () => null,
      title: 'POINTS EARNED',
    };
  }

  handleConfirm() {
    const { closeModal } = this.props;

    closeModal();
  }

  render() {
    const { data, points } = this.props;
    const { amount = 0 } = data;

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        <View styleName="vertical flexible h-center v-center xl-gutter-horizontal">
          <Subtitle styleName="oval-highlight">
            {amount ? `Your bill was $${amount}` : ''}
          </Subtitle>
          <Title
            style={{
              fontSize: 45,
              height: 54,
              lineHeight: 54,
            }}
            styleName="lg-gutter-vertical"
          >
            {`+${points}`}
          </Title>
          <Title styleName="h-center">Congratulations!</Title>
          <Subtitle styleName="h-center md-gutter">
            {`You've earned ${points} points!`}
          </Subtitle>
          <Button
            styleName="secondary xl-gutter-vertical"
            onPress={this.handleConfirm}
          >
            <Text>CONFIRM</Text>
          </Button>
        </View>
      </Screen>
    );
  }
}

export default connect(undefined, { closeModal })(
  connectStyle(ext('PointsEarnedScreen'))(PointsEarnedScreen),
);
