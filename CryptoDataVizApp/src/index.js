
import React, { Component } from 'react';
import { Screen, Subtitle, Divider } from '@shoutem/ui';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider, connect } from 'react-redux';

import rootReducer from './reducer';
import { initData } from './actions';
import CurrentValue from './CurrentValue';
import TransactionVolumeGraph, { Description } from './TransactionVolumeGraph';

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

class App extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(initData());
    }

    render() {
        return (
            <Screen>
                <Divider />
                <CurrentValue />
                <Divider />
                <Divider />
                <TransactionVolumeGraph />
                <Divider />
                <Description />
            </Screen>
        )
    }
}

const ConnectedApp = connect(state => state)(App);

export default () => (
    <Provider store={store}>
        <ConnectedApp />
    </Provider>
)
