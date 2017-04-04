
import React, { Component } from 'react';

import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import ChatUI from './components/ChatUI';
import LoginUI from './components/LoginUI';
import rootReducer from './reducers';
import { fetchMessages, checkUserExists } from './actions';


const loggerMiddleware = createLogger();

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        //loggerMiddleware
    )
);

import { Examples } from '@shoutem/ui';

const LoginOrChat = connect(
    (state) => ({
        authorized: state.user.authorized
    })
)(({ authorized, dispatch }) => {
    if (authorized) {
        return (<ChatUI />);
    }else{
        dispatch(checkUserExists());
        return (<LoginUI />);
    }
});

class App extends Component {
    render() {
        return (
            <Provider store={store}>
               <LoginOrChat />
            </Provider>
        );
    }
}

export default App;
