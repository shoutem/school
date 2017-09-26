import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { shouldLoad } from '@shoutem/redux-io';
import { RulesForm, RulesToggleSwitch } from '../../components';
import {
  loadRules,
  createRules,
  updateRules,
  deleteRules,
  getRulesById,
} from '../../redux';

function resolveRules(ruleTemplates, rules) {
  return _.reduce(ruleTemplates, (result, ruleTemplate) => {
    const { ruleType } = ruleTemplate;

    const rule = _.find(rules, { ruleType });
    const enabled = !!rule;
    const resolvedRule = rule || ruleTemplate;

    return {
      ...result,
      [ruleType]: { ...resolvedRule, enabled },
    };
  }, {});
}

export class RulesSettings extends Component {
  constructor(props) {
    super(props);

    this.checkData = this.checkData.bind(this);
    this.handleRulesPlaceToggle = this.handleRulesPlaceToggle.bind(this);
    this.handleUpdateRules = this.handleUpdateRules.bind(this);
    this.handleUpdateRequireReceipt = this.handleUpdateRequireReceipt.bind(this);

    this.state = {
      inError: false,
    };
  }

  componentWillMount() {
    this.checkData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  checkData(nextProps, props = {}) {
    const { currentPlaceId } = props;
    const {
      programId: nextProgramId,
      currentPlaceId: nextCurrentPlaceId,
    } = nextProps;

    if (
      currentPlaceId !== nextCurrentPlaceId ||
      shouldLoad(nextProps, props, 'rules')
    ) {
      this.props.loadRules(nextProgramId, nextCurrentPlaceId);
      this.setState({ inError: false });
    }
  }

  handleRulesPlaceToggle() {
    const { rules, ruleTemplates, programId, currentPlaceId } = this.props;
    const shouldCreatePlaceRules = _.isEmpty(rules);

    if (shouldCreatePlaceRules) {
      this.props.createRules(ruleTemplates, programId, currentPlaceId);
    } else {
      this.props.deleteRules(rules, programId);
    }
  }

  handleUpdateRules(newRules) {
    const {
      programId,
      rules: initialRules,
      currentPlaceId,
    } = this.props;

    this.props.updateRules(initialRules, newRules, programId, currentPlaceId)
      .then(undefined, () => this.setState({ inError: true }));
  }

  handleUpdateRequireReceipt(requireReceiptCode) {
    const settingsPatch = { requireReceiptCode };
    this.props.onUpdateExtension(settingsPatch);
  }

  render() {
    const {
      rules,
      ruleTemplates,
      currentPlaceId,
      requireReceiptCode,
    } = this.props;

    const { inError } = this.state;

    const hasRules = !_.isEmpty(rules);
    const showRulesForm = !currentPlaceId || hasRules;
    const resolvedRules = resolveRules(ruleTemplates, rules);

    return (
      <div className="rules-settings">
        <h3>Program settings</h3>
        {currentPlaceId &&
          <RulesToggleSwitch
            onToggle={this.handleRulesPlaceToggle}
            value={hasRules}
          />
        }
        {showRulesForm &&
          <RulesForm
            onUpdateRequiredReceipt={this.handleUpdateRequireReceipt}
            onUpdateRules={this.handleUpdateRules}
            requireReceiptCode={requireReceiptCode}
            rules={resolvedRules}
          />
        }
        {inError &&
          <p className="text-error">
            Something went wrong. Please refresh this page and try again.
          </p>
        }
      </div>
    );
  }
}

RulesSettings.propTypes = {
  rules: PropTypes.object,
  ruleTemplates: PropTypes.array,
  programId: PropTypes.string,
  currentPlaceId: PropTypes.string,
  requireReceiptCode: PropTypes.bool,
  loadRules: PropTypes.func,
  createRules: PropTypes.func,
  updateRules: PropTypes.func,
  deleteRules: PropTypes.func,
  onUpdateExtension: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    rules: getRulesById(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { extensionName } = ownProps;
  const scope = { extensionName };

  return {
    loadRules: (programId, placeId) => (
      dispatch(loadRules(programId, placeId, scope))
    ),
    createRules: (ruleTemplates, programId, placeId) => (
      dispatch(createRules(ruleTemplates, programId, placeId, scope))
    ),
    updateRules: (initialRules, newRules, programId, placeId) => (
      dispatch(updateRules(initialRules, newRules, programId, placeId, scope))
    ),
    deleteRules: (rules, programId) => (
      dispatch(deleteRules(rules, programId, scope))
    ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesSettings);
