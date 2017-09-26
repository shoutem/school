import React, {
  Component,
} from 'react';

import _ from 'lodash';

import { connect } from 'react-redux';

import {
  getCollection,
 } from '@shoutem/redux-io';

import {
  Button,
  Caption,
  Text,
  Tile,
  Title,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';
import { ext } from '../const';

import {
  placeShape,
  transactionShape,
 } from './shapes';

const { arrayOf, func } = React.PropTypes;

/**
 * A component for place loyalty points layout.
 */
class PlaceLoyaltyPointsView extends Component {
  static propTypes = {
    // The place
    place: placeShape.isRequired,
    // Called when collect points is pressed
    onCollectPointsPress: func,
    // Called when points history is pressed
    onPointsHistoryPress: func,
    // Transactions for this place
    transactions: arrayOf(transactionShape),
  };

  render() {
    const { place, onCollectPointsPress, onPointsHistoryPress, transactions } = this.props;

    return (
      <Tile>
        <View styleName="content h-center lg-gutter-vertical vertical">
          <Caption>Points collected</Caption>
          <Title styleName="md-gutter-top">{place.points || 'No points collected'}</Title>
          <View styleName="horizontal lg-gutter-top">
            <Button
              onPress={onCollectPointsPress}
              styleName="secondary md-gutter-right"
            >
              <Text>COLLECT</Text>
            </Button>
            {_.size(transactions) ?
              <Button onPress={onPointsHistoryPress}>
                <Text>HISTORY</Text>
              </Button>
              :
              null
            }
          </View>
        </View>
      </Tile>
    );
  }
}

const getTransactionsForPlace = (transactions, place) =>
  _.filter(transactions, (transaction) => {
    const { transactionData } = transaction;

    return place.id === transactionData.location;
  });

export const mapStateToProps = (state, ownProps) => {
  const { allTransactions } = state[ext()];
  const { place } = ownProps;

  const transactions = getCollection(allTransactions, state);

  return {
    transactions: getTransactionsForPlace(transactions, place),
  };
};

export default connect(mapStateToProps)(
  connectStyle(ext('PlaceLoyaltyPointsView'))(PlaceLoyaltyPointsView),
);
