
import React, { Component } from 'react';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import ChatUI from './components/ChatUI';
import reducer from './reducers';
import { fetchMessages } from './actions';


const loggerMiddleware = createLogger();

const store = createStore(
    reducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);

import { Examples } from '@shoutem/ui';

store.dispatch(fetchMessages());

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <ChatUI />
            </Provider>
        );
    }
}

export default App;
