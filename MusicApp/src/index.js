
import React, { Component } from 'react';
import { Screen, View, Heading, NavigationBar, Title, Image } from '@shoutem/ui';

import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import Genres from './Genres';
import rootReducer from './reducer';

const Radio = () => (
    <Image source={require('./media/radio.png')}
           style={{width: 64, height: 64 }} />
);

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);

const AppUI = connect(
    (state) => ({
        genres: state.genres
    })
)(({ genres }) => (
    <Screen>
        <NavigationBar centerComponent={<Radio />} />

        <View style={{paddingTop: 80}}>
            <Heading styleName="h-center">
                What do you feel like?
            </Heading>

            <Genres genres={genres} />
        </View>
    </Screen>
));

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppUI />
            </Provider>
        )
    }
}

export default App;
