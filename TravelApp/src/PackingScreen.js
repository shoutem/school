
import React, { Component, PureComponent } from 'react';
import { TabNavigator } from 'react-navigation';
import { Image } from 'react-native';

import styles from './styles';
import PackingList from './PackingList';

const tabBarIcon = (icon) => ({ tintColor }) => (
    <Image source={icon}
           style={[{width: 26, height: 26}, {tintColor: tintColor}]} />
);

const PackingScreen = TabNavigator({
    Toiletries: {
        screen: ({ navigation }) => <PackingList navigation={navigation} />,
        navigationOptions: {
            tabBarLabel: 'Toiletries',
            tabBarIcon: tabBarIcon(require('./images/toothbrush.png'))
        }
    },
    Clothes: {
        screen: ({ navigation }) => <PackingList navigation={navigation} />,
        navigationOptions: {
            tabBarLabel: 'Clothes',
            tabBarIcon: tabBarIcon(require('./images/shirt.png'))
        }
    },
    Gear: {
        screen: ({ navigation }) => <PackingList navigation={navigation} />,
        navigationOptions: {
            tabBarLabel: 'Gear',
            tabBarIcon: tabBarIcon(require('./images/headphones.png'))
        }
    }
}, {
    tabBarOptions: {
        activeTintColor: '#e91e63'
    }
});

export default PackingScreen;
