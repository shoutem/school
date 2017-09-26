import React, {
  Component,
} from 'react';

import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';

import {
  Caption,
  Divider,
  Screen,
  ListView,
  Row,
  Subtitle,
  Text,
  TouchableOpacity,
  View,
} from '@shoutem/ui';

import { EmptyStateView } from '@shoutem/ui-addons';
import { NavigationBar } from '@shoutem/ui/navigation';
import { connectStyle } from '@shoutem/theme';

import { ext } from '../../const';
import { refreshShippingMethods, selectShippingMethod } from '../../redux/actionCreators';
import CartFooter from '../../components/CartFooter';
import { shippingMethods as shippingMethodsShape, shop as shopShape } from '../../components/shapes';

/*
 * Used to get a user friendly caption for delivery dates.
 * Shopify bridge returns an array where the first item is the earliest delivery date
 * measured in miliseconds from 1970 and the second item is the latest delivery date.
 * This function formats it to something user friendly such as '2-5 days' or '5 days'
 * // TODO: Will we use this '2-5 days' format in the UI
 *
 */
const getDeliveryRangeCaption = ([startDateInMiliseconds, endDateInMiliseconds]) => {
  const daysInBetweenFirst = 1 + moment(startDateInMiliseconds).diff(moment(), 'days');
  const daysInBetweenLast = 1 + moment(endDateInMiliseconds).diff(moment(), 'days');

  let plural;
  let deliveryDays;

  if (daysInBetweenLast - daysInBetweenFirst === 0) {
    plural = daysInBetweenFirst > 1;
    deliveryDays = daysInBetweenFirst;
  } else {
    plural = true;
    deliveryDays = [daysInBetweenFirst, daysInBetweenLast].join('-');
  }

  return `${deliveryDays} day${plural ? 's' : ''}`;
};

const renderEmptyScreen = () => {
  const message = 'We could not get any shipping options from Shopify.' +
    ' Please check with the store owner if he provides shipping to your country for this item.';

  return (
    <EmptyStateView message={message} />
  );
};

const { func } = React.PropTypes;

/**
 * Lets the user select between one of the available shipping methods
 */
class ShippingMethodScreen extends Component {
  static propTypes = {
    // Refreshes available shipping methods each time this screen is loaded
    refreshShippingMethods: func.isRequired,
    // Dispatched when a shipping method is selected
    selectShippingMethod: func.isRequired,
    // Shipping methods statusobject
    shippingMethods: shippingMethodsShape.isRequired,
    // Shop details, used to display currency
    shop: shopShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.proceedToPayment = this.proceedToPayment.bind(this);
    this.renderShippingMethod = this.renderShippingMethod.bind(this);
  }

  componentWillMount() {
    const { refreshShippingMethods } = this.props;

    refreshShippingMethods();
  }

  proceedToPayment(method) {
    const { selectShippingMethod } = this.props;

    selectShippingMethod(method);
  }

  renderShippingMethod(method) {
    const { deliveryRange, title, price } = method;
    const { currency } = this.props.shop;

    return (
      <TouchableOpacity onPress={() => this.proceedToPayment(method)}>
        <Row>
          <View
            styleName="vertical stretch space-between"
          >
            <Subtitle>{title}</Subtitle>
            <Text>{`${price} ${currency}`}</Text>
            {deliveryRange ?
              <Caption>{`Estimated delivery time: ${getDeliveryRangeCaption(deliveryRange)}`}</Caption>
              :
              null
            }
          </View>
        </Row>
      </TouchableOpacity>
    );
  }

  renderShippingMethods() {
    const { isLoading, methods = [] } = this.props.shippingMethods;

    return (
      <Screen>
        <NavigationBar
          title="SHIPPING"
        />
        <View style={{ marginTop: 30 }} />
        <ListView
          data={methods}
          loading={isLoading}
          renderRow={this.renderShippingMethod}
        />
        <Divider styleName="line" />
        <CartFooter />
      </Screen>
    );
  }

  render() {
    const { error, isLoading, methods } = this.props.shippingMethods;
    const noItems = !isLoading && !_.size(methods);

    return error || noItems ? renderEmptyScreen() : this.renderShippingMethods();
  }
}

const mapStateToProps = (state) => {
  const { shippingMethods, shop } = state[ext()];

  return {
    shippingMethods,
    shop,
  };
};

export default connect(
  mapStateToProps, { refreshShippingMethods, selectShippingMethod })(
    connectStyle(ext('ShippingMethodScreen'))(ShippingMethodScreen),
);

