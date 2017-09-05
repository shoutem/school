
import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import { Screen, View, Image } from '@shoutem/ui';
import UITheme from '@shoutem/ui/theme';
import { StyleProvider } from '@shoutem/theme';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider, connect } from 'react-redux';

import Commitment from './Commitment';

import rootReducer from './reducer';

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

const App = connect(state => state)(({ commitments }) => {

    return (
        <StyleProvider style={theme}>
            <Screen>
                <StatusBar barStyle="light-content" />
                <Image styleName="background" source={require('./img/background.jpg')} />
                {Object.keys(commitments).map(key => <Commitment id={key} key={key}/>)}
            </Screen>
        </StyleProvider>
    )
});

export default () => (
    <Provider store={store}>
        <App />
    </Provider>
);


const theme = Object.assign(UITheme(), {
    'shoutem.ui.Image': {
        '.background': {
            flex: 1,
            resizeMode: 'repeat',
            position: 'absolute'
        }
    },
    'shoutem.ui.Heading': {
        color: 'lightcyan',
        '.variable': {
            color: 'white'
        }
    },
    'shoutem.ui.Text': {
        color: 'lightcyan',
        '.variable': {
            color: 'white'
        }
    },
    'shoutem.ui.Title': {
        fontSize: 18,
        color: 'lightcyan',
        '.variable': {
            color: 'white'
        }
    },
    'CommitApp.Commitment': {

    },
    'CommitApp.CircleButton': {
        '.green': {
            main: {
                backgroundColor: 'limegreen',
            },
            caption: {
                color: 'white'
            }
        },
    }
});
