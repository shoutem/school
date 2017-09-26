import React from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';

import {
  Button,
  Caption,
  Divider,
  FormGroup,
  Screen,
  ScrollView,
  Switch,
  View,
  Text,
  TextInput,
} from '@shoutem/ui';

import { getExtensionSettings } from 'shoutem.application';

import {
  getCollection,
  invalidate,
} from '@shoutem/redux-io';

import { navigateTo } from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { NavigationBar } from '@shoutem/ui/navigation';

import { getUser } from 'shoutem.auth';

import { ext } from '../const';

import { collectPoints } from '../services';
import { fetchRules } from '../redux';

import { authorizationShape } from '../components/shapes';

const fields = [{
  name: 'amount',
  label: 'Receipt sum',
  keyboardType: 'numeric',
}, {
  name: 'receiptCode',
  label: 'Receipt code',
}];

const CURRENCY_PREFIX = '$ ';

const RULE_VISIT = 'visit';
const RULE_PURCHASE = 'linearPoint';

const { arrayOf, bool, func, string } = React.PropTypes;

/**
 * Lets the cashier enter details about the user's shop activity and save the transaction.
 * The user can get loyalty points for visits or purchases. The server calculates points based
 * on transaction details and rules defined for the program.
 */
export class AssignPointsScreen extends React.Component {
  static propTypes = {
    // Collects points for activity
    collectPoints: func,
    // An already verified authorization
    authorization: authorizationShape,
    // Fetches available transaction rules
    fetchRules: func,
    // True if a receipt code is required, false otherwise
    requireReceiptCode: bool,
    // Availabe rule types
    rules: arrayOf(string),
  };

  constructor(props) {
    super(props);

    this.renderInput = this.renderInput.bind(this);
    this.processTransaction = this.processTransaction.bind(this);

    this.state = { purchase: false, rules: {}, visit: false };
  }

  componentWillMount() {
    const { fetchRules } = this.props;

    fetchRules();
  }

  componentWillReceiveProps(nextProps) {
    const { rules } = nextProps;

    if (_.isEmpty(rules)) {
      return;
    }

    if (_.includes(rules, RULE_PURCHASE)) {
      this.setState({ purchase: true });
    } else if (_.includes(rules, RULE_VISIT)) {
      this.setState({ visit: true });
    }
  }

  processTransaction() {
    const { collectPoints, authorization } = this.props;

    const data = { ...this.state, amount: parseFloat(this.state.amount) };

    collectPoints(data, authorization);
  }

  renderInput(field) {
    const { name, label, keyboardType } = field;

    const prefix = name === 'amount' ? CURRENCY_PREFIX : '';
    const value = this.state[name];

    return (
      <FormGroup key={name}>
        <Caption>{label.toUpperCase()}</Caption>
        <TextInput
          autoFocus
          placeholder={label}
          keyboardType={keyboardType || 'default'}
          onChangeText={text => this.setState({ [name]: text.slice(prefix.length) })}
          returnKeyType="done"
          value={`${prefix}${value || ''}`}
        />
        <Divider styleName="line sm-gutter-bottom" />
      </FormGroup>
    );
  }

  renderVisitSwitch() {
    const { visit } = this.state;

    return (
      <View styleName="horizontal v-center solid space-between md-gutter">
        <Caption>Customer visited this store</Caption>
        <Switch
          value={visit}
          onValueChange={value => this.setState({ visit: value })}
        />
      </View>
    );
  }

  renderPurchaseSwitch() {
    const { purchase } = this.state;

    return (
      <View styleName="horizontal v-center solid space-between md-gutter">
        <Caption>Customer made a purchase</Caption>
        <Switch
          value={purchase}
          onValueChange={value => this.setState({ purchase: value })}
        />
      </View>
    );
  }

  renderActivityDetails() {
    const { rules } = this.props;

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>ASSIGN POINTS FOR</Caption>
        </Divider>
        {_.includes(rules, RULE_VISIT) ? this.renderVisitSwitch() : null}
        {_.includes(rules, RULE_PURCHASE) ? this.renderPurchaseSwitch() : null}
      </View>
    );
  }

  renderPurchaseDetails() {
    const { requireReceiptCode } = this.props;

    const visibleFields = requireReceiptCode ? fields : fields.slice(0, 1);

    return (
      <View>
        <Divider styleName="section-header">
          <Caption>ENTER PURCHASE DETAILS</Caption>
        </Divider>
        {_.map(visibleFields, this.renderInput)}
      </View>
    );
  }

  renderConfirmButton() {
    return (
      <View styleName="vertical h-center">
        <Button
          styleName="secondary lg-gutter-vertical"
          style={{ width: 200 }}
          onPress={this.processTransaction}
        >
          <Text>CONFIRM</Text>
        </Button>
      </View>
    );
  }

  render() {
    const { rules } = this.props;
    const { purchase } = this.state;

    return (
      <Screen>
        <NavigationBar title="ASSIGN POINTS" />
        <ScrollView>
          {this.renderActivityDetails()}
          {purchase ? this.renderPurchaseDetails() : null}
          {!_.isEmpty(rules) ? this.renderConfirmButton() : null}
        </ScrollView>
      </Screen>
    );
  }
}

const getAvailableRules = (allRules, place) => {
  const availableRules = _.filter(allRules, rule => {
    const { location } = rule;

    // A rule is active if:
    // 1. There is no location which means it's global
    // 2. This screen is tied to a place and the rule is for this place
    return !location || (place && location === place.id);
  });

  return _.uniq(_.map(availableRules, 'ruleType'));
};

export const mapStateToProps = (state, ownProps) => {
  const { requireReceiptCode } = getExtensionSettings(state, ext());
  const { allRules } = state[ext()];
  const { place } = ownProps;

  const rules = getCollection(allRules, state);

  return {
    requireReceiptCode,
    rules: getAvailableRules(rules, place),
    user: getUser(state),
  };
};

export default connect(mapStateToProps, { collectPoints, fetchRules, invalidate, navigateTo })(
  connectStyle(ext('AssignPointsScreen'))(AssignPointsScreen),
);
