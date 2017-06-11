
import React, { Component } from 'react';

import {
    StackNavigator
} from 'react-navigation';

import { ClimatesScreen, AreasScreen } from './Screens';

const App = StackNavigator({
    Climates: { screen: ClimatesScreen },
    Areas: { screen: AreasScreen }
});

export default App
