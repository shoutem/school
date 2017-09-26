import React from 'react';
import _ from 'lodash';

import {
  isBusy,
  isError,
  isInitialized,
 } from '@shoutem/redux-io';

import {
  Button,
  Caption,
  Divider,
  Image,
  ListView,
  Row,
  Text,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';

import TransactionItem from './TransactionItem';
import { transactionShape } from './shapes';

const NO_ACTIVITY_ICON = require('../assets/icons/no-activity.png');

const { arrayOf, func } = React.PropTypes;

const VISIBLE_TRANSACTIONS = 3;

const renderTransactionRow = transaction => <TransactionItem transaction={transaction} />;

/**
 * Shows points card details for a single card loyalty program
 */
export class TransactionHistoryView extends React.Component {
  static propTypes = {
    // Called when the user presses the Show history button
    onShowHistory: func,
    // Recent transactions
    transactions: arrayOf(transactionShape),
  };

  shouldRenderPlaceholderView() {
    const { transactions } = this.props;

    if (!isInitialized(transactions) || isBusy(transactions)) {
      // Data is loading, treat it as valid for now
      return false;
    }

    // We want to render a placeholder in case of errors or if transactions are empty
    return isError(transactions) || !_.size(transactions);
  }

  // eslint-disable-next-line class-methods-use-this
  renderPlaceholderView() {
    return (
      <Row styleName="small">
        <Image
          source={NO_ACTIVITY_ICON}
          styleName="small-avatar"
        />
        <Text styleName="h-start">No activity</Text>
      </Row>
    );
  }

  renderHistoryItems() {
    const { transactions } = this.props;

    const visibleTransactions = transactions.slice(0, VISIBLE_TRANSACTIONS);

    if (this.shouldRenderPlaceholderView()) {
      return this.renderPlaceholderView();
    }

    return (
      <View>
        <ListView
          data={visibleTransactions}
          loading={isBusy(transactions)}
          renderRow={renderTransactionRow}
        />
        {this.renderShowHistoryButton()}
      </View>
    );
  }

  renderShowHistoryButton() {
    const { onShowHistory, transactions } = this.props;

    if (_.size(transactions) <= VISIBLE_TRANSACTIONS) {
      return null;
    }

    return (
      <Button
        styleName="md-gutter-vertical"
        onPress={onShowHistory}
      >
        <Text>SEE ENTIRE HISTORY</Text>
      </Button>
    );
  }

  render() {
    return (
      <View>
        <Divider styleName="section-header">
          <Caption>POINTS HISTORY</Caption>
        </Divider>
        {this.renderHistoryItems()}
      </View>
    );
  }
}

export default connectStyle(ext('TransactionHistoryView'))(TransactionHistoryView);
