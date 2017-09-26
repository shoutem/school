import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import {
  getCollection,
  next,
 } from '@shoutem/redux-io';

import {
  ListScreen,
} from 'shoutem.application';

import {
  Caption,
  Divider,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import {
  ext,
} from '../const';

import {
  placeShape,
  transactionShape,
} from '../components/shapes';

import TransactionItem from '../components/TransactionItem';

import { refreshTransactions } from '../services';

const { arrayOf, func } = React.PropTypes;

/* eslint-disable class-methods-use-this */

/**
 * Displays the transaction history for a points card.
 * A transaction can be adding points to a card or redeeming a reward.
 */
export class PointsHistoryScreen extends ListScreen {
  static propTypes = {
    ...ListScreen.propTypes,
    // Transactions
    data: arrayOf(transactionShape),
    // Place to which transactions belong to
    place: placeShape,
    next: func,
    // Refreshes transactions
    refreshTransactions: func,
  };

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
  }

  fetchData() {
    const { refreshTransactions } = this.props;

    refreshTransactions();
  }

  getSectionId({ createdAt }) {
    return moment(createdAt).format('YYYY');
  }

  renderSectionHeader(sectionId) {
    const currentYear = moment().format('YYYY');

    return (
      sectionId === currentYear ?
        null
        :
        <Divider styleName="section-header">
          <Caption>{sectionId}</Caption>
        </Divider>
    );
  }

  renderRow(transaction) {
    const { place } = this.props;
    const { transactionData } = transaction;

    if (place && place.id !== transactionData.location) {
      return null;
    }

    return <TransactionItem transaction={transaction} />;
  }

  getNavigationBarProps() {
    return {
      title: 'POINTS HISTORY',
    };
  }
}

export const mapStateToProps = (state) => {
  const { allTransactions } = state[ext()];

  return {
    data: getCollection(allTransactions, state),
  };
};

export const mapDispatchToProps = { next, refreshTransactions };

export default connect(mapStateToProps, mapDispatchToProps)(
  connectStyle(ext('PointsHistoryScreen'))(PointsHistoryScreen),
);

