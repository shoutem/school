
import React, { Component } from 'react';

import {
    StackNavigator
} from 'react-navigation';

import ClimatesScreen from './ClimatesScreen';

const App = StackNavigator({
    Climates: { screen: ClimatesScreen }
});

export default App
