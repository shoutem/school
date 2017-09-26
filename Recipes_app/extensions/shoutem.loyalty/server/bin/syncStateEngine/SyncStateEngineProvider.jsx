import React, { PropTypes, Component, Children } from 'react';
import { connect } from 'react-redux';
import sandbox from '@shoutem/extension-sandbox';
import ext from '../../src/const';

export class SyncStateEngineProvider extends Component {
  constructor(props) {
    super(props);

    this.handleActions = this.handleActions.bind(this);
    this.handleSandboxMessage = this.handleSandboxMessage.bind(this);
    this.checkData = this.checkData.bind(this);

    this.syncStateEngine = this.props.syncStateEngine;

    sandbox.subscribe(this.handleSandboxMessage);
    this.checkData(props);
  }

  componentDidMount() {
    this.syncStateEngine.subscribeToActions(this.handleActions);
  }

  componentWillReceiveProps(nextProps) {
    this.checkData(nextProps, this.props);
  }

  componentWillUnmount() {
    this.syncStateEngine.unsubscribeFromActions(this.handleActions);
  }

  checkData(nextProps, props = {}) {
    const { state } = props;
    const { state: nextState } = nextProps;

    const action = this.syncStateEngine.calculateDifferences(
      state,
      nextState,
      ext(),
    );

    if (action) {
      sandbox.sendMessage(...action);
    }
  }

  handleActions(action, source) {
    if (_.get(source, 'id') === 'builder') {
      return;
    }

    sandbox.sendMessage(...action);
  }

  handleSandboxMessage(message) {
    const source = {
      id: 'builder',
    };

    const action = this.syncStateEngine.processExternalChange(message, source);
    if (action) {
      this.props.syncAction(action);
    }
  }

  render() {
    const { children } = this.props;

    return Children.only(children);
  }
}

SyncStateEngineProvider.propTypes = {
  state: React.PropTypes.object,
  syncStateEngine: React.PropTypes.object,
  syncAction: React.PropTypes.func,
  children: PropTypes.node,
};

function mapStateToProps(state) {
  return {
    state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    syncAction: action => dispatch(action),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncStateEngineProvider);
