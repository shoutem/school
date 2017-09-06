
import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import { Screen, View, Image, ListView, Text } from '@shoutem/ui';
import { Dimensions } from 'react-native';
import UITheme from '@shoutem/ui/theme';
import { StyleProvider } from '@shoutem/theme';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Provider, connect } from 'react-redux';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import * as storage from 'redux-storage';

import Commitment from './Commitment';

import rootReducer from './reducer';

const engine = createEngine('com.school.shoutem.CommitApp');
const storageMiddleware = storage.createMiddleware(engine);

const store = createStore(
    rootReducer,
    applyMiddleware(
        createLogger(),
        storageMiddleware
    )
);

const load = storage.createLoader(engine);
load(store);

const App = connect(state => state)(({ commitments }) => {
    let list = Object.keys(commitments)
                     .sort((a, b) => a < b ? -1 : (a > b ? 1 : 0));

    return (
        <StyleProvider style={theme}>
            <Screen>
                <StatusBar barStyle="light-content" />
                <Image styleName="background" source={require('./img/background.jpg')} />
                <ListView data={list}
                          renderRow={(id) => <Commitment id={id} key={id} />}
                          horizontal={true}
                          pageSize={1}
                          snapToInterval={Dimensions.get('window').width}
                          snapToAlignment="center"
                          decelerationRate={0}/>
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
    'shoutem.ui.ListView': {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        flex: 1
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
        '.transparent': {
            main: {
                backgroundColor: 'rgba(255, 255, 255, .2)',
                borderColor: 'white',
                borderWidth: 1.5
            },
            caption: {
                color: 'white'
            }
        }
    }
});
