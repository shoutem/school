import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { FormGroup } from 'react-bootstrap';
import { Switch } from '@shoutem/react-web-ui';
import './style.scss';

/**
 * Extracts rule value from rule. Rule value is located in field `implementationData`,
 * under key that is provided through `valueKey` parameter.
 */
function getValueFromRule(rule, valueKey) {
  return _.get(rule, ['implementationData', valueKey]);
}

export default class RuleTableRow extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRuleChanged = this.handleRuleChanged.bind(this);
    this.handleToggleRule = this.handleToggleRule.bind(this);

    const { rule, valueKey } = props;
    const { enabled } = rule;
    const value = getValueFromRule(rule, valueKey);

    this.state = {
      value,
      enabled,
      isValid: true,
    };
  }

  handleInputChange(event) {
    const { validateRule } = this.props;
    const value = event.target.value;

    const isValid = validateRule(value);
    this.setState({ value, isValid });

    if (isValid) {
      this.handleRuleChanged(value);
    }
  }

  handleRuleChanged(value) {
    const { rule, onRuleChange, valueKey, valueTransformer } = this.props;
    const finalValue = valueTransformer(value);

    const { id, ruleType, enabled } = rule;

    const rulePatch = {
      id,
      ruleType,
      enabled,
      implementationData: { [valueKey]: finalValue },
    };

    onRuleChange(rule, rulePatch);
  }

  handleToggleRule() {
    const { rule } = this.props;
    const { enabled } = this.state;

    this.setState({ enabled: !enabled });
    this.props.onRuleToggle(rule, !enabled);
  }

  render() {
    const { customerAction, unit } = this.props;
    const { value, enabled, isValid } = this.state;

    const validationState = isValid ? 'success' : 'error';
    const classes = classNames('rule-table-row', { disabled: !enabled });

    return (
      <tr className={classes}>
        <td>{customerAction}</td>
        <td>
          <FormGroup validationState={validationState}>
            <input
              className="form-control"
              disabled={!enabled}
              onChange={this.handleInputChange}
              type="text"
              value={value}
            />
            <label className="rule-table-row__unit">{unit}</label>
          </FormGroup>
        </td>
        <td>
          <Switch
            onChange={this.handleToggleRule}
            value={enabled}
          />
        </td>
      </tr>
    );
  }
}

RuleTableRow.propTypes = {
  rule: PropTypes.object,
  onRuleChange: PropTypes.func,
  onRuleToggle: PropTypes.func,
  unit: PropTypes.string,
  customerAction: PropTypes.string,
  valueKey: PropTypes.string,
  validateRule: PropTypes.func,
  valueTransformer: PropTypes.func,
};
