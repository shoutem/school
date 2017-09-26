import React, {
  Component,
} from 'react';

import moment from 'moment';

import {
  Caption,
  Divider,
  Image,
  Row,
  Subtitle,
  View,
} from '@shoutem/ui';

import { connectStyle } from '@shoutem/theme';

import { ext } from '../const';
import { transactionShape } from '../components/shapes';

const TRANSACTION_DATE_FORMAT = 'MMMM DD';

const GIFT_ICON = require('../assets/icons/gift.png');
const PLUS_ICON = require('../assets/icons/plus.png');

/**
 * A points card transaction item, used to display transaction history
 */
class TransactionItem extends Component {
  static propTypes = {
    // The transaction
    transaction: transactionShape.isRequired,
  };

  render() {
    const { transaction } = this.props;
    const { createdAt, transactionData } = transaction;

    const { amount, points, purchase, rewardName = '' } = transactionData;

    const isRedeemed = points < 0;

    const action = isRedeemed ? 'Reward redeemed' : 'Points gained';
    const activity = `Store visited ${purchase ? ` ·  $${amount} spent` : ''}`;
    const subtitle = isRedeemed ? rewardName : activity;

    const date = moment(createdAt).format(TRANSACTION_DATE_FORMAT);

    return (
      <View>
        <Row>
          <Image
            source={isRedeemed ? GIFT_ICON : PLUS_ICON}
            styleName="small-avatar"
          />
          <View
            style={{ flex: 6 }}
            styleName="vertical stretch space-between"
          >
            <Subtitle>{action}</Subtitle>
            <View styleName="horizontal">
              <Caption>
                {`${date}  ·  ${subtitle}`}
              </Caption>
            </View>
          </View>
          <Subtitle
            style={{ flex: 1 }}
            styleName="h-right"
          >
            {`${isRedeemed ? '' : '+'}${points}`}
          </Subtitle>
        </Row>
        <Divider styleName="line" />
      </View>
    );
  }
}

export default connectStyle(ext('TransactionItem'))(TransactionItem);
