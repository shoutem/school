
import React, { Component } from 'react';
import { Screen, Heading, Divider } from '@shoutem/ui';
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
            <Heading styleName="h-center">Cryptocurrency Market Cap</Heading>

            <MarketCapGraph />
        </Screen>
    </Provider>
);

export default App;
