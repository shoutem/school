import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { ControlLabel } from 'react-bootstrap';
import {
  validateNumericRule,
  transformNumericRule,
} from '../../services';
import RuleTableRow from '../rule-table-row';
import './style.scss';

export const RULES_TO_DISPLAY = {
  VISIT: {
    type: 'visit',
    customerAction: 'Visit (QR or PIN verification)',
    unit: 'points',
    valueKey: 'pointsPerVisit',
    valueTransformer: transformNumericRule,
    validateRule: validateNumericRule,
  },
  LINEAR_POINT: {
    type: 'linearPoint',
    customerAction: 'Purchase (PIN, QR or receipt scanning)',
    unit: 'points per currency unit',
    valueKey: 'coefficient',
    valueTransformer: transformNumericRule,
    validateRule: validateNumericRule,
  },
};

export default class RulesTable extends Component {
  constructor(props) {
    super(props);

    this.renderRuleTableRow = this.renderRuleTableRow.bind(this);
  }

  renderRuleTableRow(ruleType) {
    const { rules, onRuleChange, onRuleToggle } = this.props;
    const rule = _.find(rules, { ruleType: ruleType.type });

    if (!rule) {
      return null;
    }

    return (
      <RuleTableRow
        key={`${rule.ruleType}-${rule.id}`}
        onRuleChange={onRuleChange}
        onRuleToggle={onRuleToggle}
        rule={rule}
        {...ruleType}
      />
    );
  }

  render() {
    return (
      <table className="table rules-table">
        <thead>
          <tr>
            <th className="rules-table__action-col">
              <ControlLabel>Customer’s action</ControlLabel>
            </th>
            <th className="rules-table__value-col">
              <ControlLabel>Value</ControlLabel>
            </th>
            <th className="rules-table__enabled-col">
              <ControlLabel>Rule enabled</ControlLabel>
            </th>
          </tr>
        </thead>
        <tbody>
          {_.map(RULES_TO_DISPLAY, this.renderRuleTableRow)}
        </tbody>
      </table>
    );
  }
}

RulesTable.propTypes = {
  rules: PropTypes.object,
  onRuleChange: PropTypes.func,
  onRuleToggle: PropTypes.func,
};
