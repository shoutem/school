
import React, { Component } from 'react';

import {
    StackNavigator
} from 'react-navigation';

import { ClimatesScreen, AreasScreen, AccomodationsScreen } from './Screens';
import PackingScreen from './PackingScreen';

const App = StackNavigator({
    Climates: { screen: ClimatesScreen },
    Areas: {
        screen: AreasScreen,
        path: 'areas/:climate'
    },
    Accomodations: {
        screen: AccomodationsScreen,
        path: 'accomodations/:climate/:area'
    },
    PackingList: {
        screen: PackingScreen,
        path: 'packing/:climate/:area/:accomodation'
    }
});

export default App
