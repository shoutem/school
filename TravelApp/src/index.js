
import React, { Component } from 'react';

import {
    StackNavigator
} from 'react-navigation';

import { ClimatesScreen, AreasScreen, AccomodationsScreen } from './Screens';

const App = StackNavigator({
    Climates: { screen: ClimatesScreen },
    Areas: { screen: AreasScreen },
    Accomodations: { screen: AccomodationsScreen }
});

export default App
