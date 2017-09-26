import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { Button, FormGroup, Checkbox } from 'react-bootstrap';
import RulesTable from '../../components/rules-table';
import './style.scss';

export default class RulesSettings extends Component {
  constructor(props) {
    super(props);

    this.handleRuleChange = this.handleRuleChange.bind(this);
    this.handleSaveChangesClick = this.handleSaveChangesClick.bind(this);
    this.handleRequireReceiptToggle = this.handleRequireReceiptToggle.bind(this);
    this.updateChangedRules = this.updateChangedRules.bind(this);
    this.updateRequireReceipt = this.updateRequireReceipt.bind(this);
    this.handleRuleEnabledToggle = this.handleRuleEnabledToggle.bind(this);
    this.calculateHasChanges = this.calculateHasChanges.bind(this);

    const { requireReceiptCode, rules } = props;

    this.state = {
      requireReceiptCode,
      rules,
      rulePatches: {},
      inProgress: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { rules: nextRules } = nextProps;
    const { rules } = this.props;

    if (rules !== nextRules) {
      this.setState({ rules: nextRules });
    }
  }

  handleRuleChange(rule, rulePatch) {
    const { rules } = this.state;
    const { ruleType } = rule;

    this.setState({
      rules: {
        ...rules,
        [ruleType]: rulePatch,
      },
    }, this.calculateHasChanges);
  }

  handleRuleEnabledToggle(rule, enabled = true) {
    const { rules } = this.state;
    const { ruleType } = rule;

    this.setState({
      rules: {
        ...rules,
        [ruleType]: { ...rule, enabled },
      },
    }, this.calculateHasChanges);
  }

  handleRequireReceiptToggle() {
    const { requireReceiptCode } = this.state;

    this.setState({
      requireReceiptCode: !requireReceiptCode,
    }, this.calculateHasChanges);
  }

  handleSaveChangesClick() {
    this.setState({ inProgress: true });

    Promise.all([
      this.updateChangedRules(),
      this.updateRequireReceipt(),
    ]).then(() => this.setState({
      inProgress: false,
      hasChanges: false,
    }));
  }

  updateChangedRules() {
    const { rules: initialRules } = this.props;
    const { rules } = this.state;

    if (_.isEqual(rules, initialRules)) {
      return Promise.resolve();
    }

    return this.props.onUpdateRules(rules);
  }

  updateRequireReceipt() {
    const { requireReceiptCode: initialRequireReceiptCode } = this.props;
    const { requireReceiptCode } = this.state;

    if (requireReceiptCode === initialRequireReceiptCode) {
      return Promise.resolve();
    }

    return this.props.onUpdateRequiredReceipt(requireReceiptCode);
  }

  calculateHasChanges() {
    const {
      requireReceiptCode,
      rules,
    } = this.state;

    const {
      rules: initialRules,
      requireReceiptCode: initialRequireReceiptCode,
    } = this.props;

    const hasChanges = (
      initialRequireReceiptCode !== requireReceiptCode ||
      !_.isEqual(initialRules, rules)
    );

    this.setState({ hasChanges });
  }

  render() {
    const {
      requireReceiptCode,
      rules,
      inProgress,
      hasChanges,
    } = this.state;

    return (
      <div className="rules-form">
        <RulesTable
          onRuleChange={this.handleRuleChange}
          onRuleToggle={this.handleRuleEnabledToggle}
          rules={rules}
        />
        <FormGroup>
          <Checkbox
            checked={!!requireReceiptCode}
            onChange={this.handleRequireReceiptToggle}
          >
            Require receipt code for purchase validation
          </Checkbox>
        </FormGroup>
        <Button
          bsStyle="primary"
          disabled={!hasChanges}
          onClick={this.handleSaveChangesClick}
        >
          <LoaderContainer isLoading={inProgress}>
            Update settings
          </LoaderContainer>
        </Button>
      </div>
    );
  }
}

RulesSettings.propTypes = {
  rules: PropTypes.object,
  requireReceiptCode: PropTypes.bool,
  onUpdateRules: PropTypes.func,
  onUpdateRequiredReceipt: PropTypes.func,
};
