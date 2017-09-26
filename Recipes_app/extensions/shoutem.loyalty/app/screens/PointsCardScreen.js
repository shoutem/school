import React from 'react';

import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';

import _ from 'lodash';

import {
  getCollection,
  isInitialized,
 } from '@shoutem/redux-io';

import {
  navigateTo,
  openInModal,
 } from '@shoutem/core/navigation';

import {
  Button,
  Caption,
  Screen,
  ScrollView,
  Spinner,
  Title,
  Text,
  View,
  TouchableOpacity,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import {
  loginRequired,
} from 'shoutem.auth';

import {
  getExtensionSettings,
} from 'shoutem.application';

import { QRCodeScanner } from 'shoutem.camera';

import { ext } from '../const';

import {
  fetchCashierInfo,
  getCardId,
  getSingleCardState,
} from '../redux';

import {
  authorizeTransactionByQRCode,
  refreshCardState,
  refreshTransactions,
} from '../services';

import NoProgramScreen from './NoProgramScreen';
import TransactionHistoryView from '../components/TransactionHistoryView';

import {
  cashierShape,
  transactionShape,
 } from '../components/shapes';

const { arrayOf, func, number, shape, string } = React.PropTypes;

/**
 * Shows points card details for a single card loyalty program
 */
export class PointsCardScreen extends React.Component {
  static propTypes = {
    // Assigns points to card when cashier scans a QR code
    authorizeTransactionByQRCode: func,
    // Card ID for user's loyalty card
    cardId: string,
    // Card state, with points
    cardState: shape({
      points: number,
    }),
    // Cashier info for this user, empty if he's not a cashier.
    // A cashier can scan a QR code and a user can see his points card info.
    cashierInfo: cashierShape,
    // Navigates to points history screen
    navigateTo: func,
    // Opens the assign points flow in a modal dialog
    openInModal: func,
    // ID of loyalty program for this extension
    programId: string,
    // Refreshes loyalty card points
    refreshCardState: func,
    // Refreshes loyalty card transactions
    refreshTransactions: func,
    // Recent transactions
    transactions: arrayOf(transactionShape),
  };

  constructor(props) {
    super(props);

    this.assignPoints = this.assignPoints.bind(this);
    this.handleScanCode = this.handleScanCode.bind(this);
    this.navigateToPointsHistoryScreen = this.navigateToPointsHistoryScreen.bind(this);
    this.refreshCardState = this.refreshCardState.bind(this);
  }

  componentWillMount() {
    this.refreshCardState();
  }

  assignPoints() {
    const { openInModal } = this.props;

    openInModal({
      screen: ext('PinVerificationScreen'),
    });
  }

  handleScanCode(code) {
    const { authorizeTransactionByQRCode } = this.props;

    authorizeTransactionByQRCode(code.data);
  }

  navigateToPointsHistoryScreen() {
    const { navigateTo } = this.props;

    navigateTo({
      screen: ext('PointsHistoryScreen'),
    });
  }

  refreshCardState() {
    const { refreshCardState, refreshTransactions } = this.props;

    refreshCardState();
    refreshTransactions();
  }

  renderPointsCardInfo() {
    const { cardId, cardState = {}, transactions } = this.props;
    const { points = 0 } = cardState;

    return (
      <Screen>
        <NavigationBar title="MY CARD" />
        <ScrollView>
          <View styleName="content sm-gutter solid vertical h-center">
            <TouchableOpacity onPress={this.assignPoints}>
              <QRCode
                size={160}
                value={JSON.stringify([cardId])}
              />
            </TouchableOpacity>
            <Caption styleName="h-center sm-gutter">Points</Caption>
            <Title styleName="h-center">{points}</Title>
            <Button
              styleName="secondary md-gutter-vertical"
              style={{ width: 160 }}
              onPress={this.refreshCardState}
            >
              <Text>REFRESH</Text>
            </Button>
          </View>
          <TransactionHistoryView
            onShowHistory={this.navigateToPointsHistoryScreen}
            transactions={transactions}
          />
        </ScrollView>
      </Screen>
    );
  }

  renderQRCodeScanner() {
    return (
      <QRCodeScanner
        onQRCodeScanned={this.handleScanCode}
      />);
  }

  renderContent() {
    const { cashierInfo } = this.props;

    if (!isInitialized(cashierInfo)) {
      return <Spinner styleName="xl-gutter-top" />;
    }

    const isUserACashier = _.has(cashierInfo, 'data');

    return isUserACashier ? this.renderQRCodeScanner() : this.renderPointsCardInfo();
  }

  renderScreen() {
    return (
      <Screen>
        <NavigationBar title="MY CARD" />
        {this.renderContent()}
      </Screen>
    );
  }

  render() {
    const { programId } = this.props;

    return programId ? this.renderScreen() : (<NoProgramScreen />);
  }
}

export const mapStateToProps = (state) => {
  const { allTransactions, cashierInfo } = state[ext()];

  const extensionSettings = getExtensionSettings(state, ext());
  const programId = _.get(extensionSettings, 'program.id');

  return {
    cardId: getCardId(state),
    cardState: getSingleCardState(state),
    cashierInfo,
    programId,
    transactions: getCollection(allTransactions, state),
  };
};

export const mapDispatchToProps = {
  authorizeTransactionByQRCode,
  fetchCashierInfo,
  refreshCardState,
  refreshTransactions,
  navigateTo,
  openInModal,
};

export default loginRequired(connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PointsCardScreen'))(PointsCardScreen),
));
