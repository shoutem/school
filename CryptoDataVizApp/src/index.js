
import React, { Component } from 'react';
import { Screen, Subtitle, Divider } from '@shoutem/ui';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider, connect } from 'react-redux';

import rootReducer from './reducer';
import MarketCapGraph from './MarketCapGraph';

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

const App = () => (
    <Provider store={store}>
        <Screen>
            <Divider />
            <Subtitle styleName="h-center">Current Crypto Value</Subtitle>

            <MarketCapGraph />
        </Screen>
    </Provider>
);

export default App;
