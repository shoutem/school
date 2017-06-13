
import React, { Component, PureComponent } from 'react';
import { TabNavigator } from 'react-navigation';
import { View, Image, Text, FlatList, Switch } from 'react-native';

import styles from './styles';

const tabBarIcon = (icon) => ({ tintColor }) => (
    <Image source={icon}
           style={[{width: 26, height: 26}, {tintColor: tintColor}]} />
);

class ListItem extends PureComponent {
    _onValueChange = () => {
        this.props.onItemToggle(this.props.id)
    }

    render() {
        const { value, name } = this.props;

        return (
            <View style={styles.listItem}>
                <Switch value={value}
                        onValueChange={this._onValueChange} />
                <Text style={styles.listItemText}>{name}</Text>
            </View>
        )
    }
}

class PackingList extends PureComponent {
    state = {
        items: [
            {value: false, id: 0, name: 'Toothbrush'},
            {value: false, id: 1, name: 'Toothpaste'}
        ]
    }

    _keyExtractor = (item, index) => item.id;

    _onItemToggle = (id) => {
        this.setState((state) => {
            const items = state.items.map(
                item => {
                    item = Object.assign({}, item);
                    if (item.id === id) {
                        item.value = !item.value;
                    }
                    return item;
                }
            );

            return { items };
        });
    }

    _renderItem = ({ item }) => (
        <ListItem id={item.id}
                  onItemToggle={this._onItemToggle}
                  {...item} />

    );

    render() {
        const { navigation } = this.props,
              { climate, area, accomodation } = navigation.state.params,
              { routeName } = navigation.state;

        return (
            <View style={styles.container}>
                <Text style={styles.header}>Packing {routeName.toLowerCase()} for {climate.toLowerCase()} weather {accomodation === 'Couch' ? 'on' : 'in'} a {area.toLowerCase()} {accomodation.toLowerCase()}</Text>
                <FlatList data={this.state.items}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          contentContainerStyle={styles.packingList} />
            </View>
        )
    }
}


const PackingScreen = TabNavigator({
    Toiletries: {
        screen: PackingList,
        navigationOptions: {
            tabBarLabel: 'Toiletries',
            tabBarIcon: tabBarIcon(require('./images/toothbrush.png'))
        }
    },
    Clothes: {
        screen: PackingList,
        navigationOptions: {
            tabBarLabel: 'Clothes',
            tabBarIcon: tabBarIcon(require('./images/shirt.png'))
        }
    },
    Gear: {
        screen: PackingList,
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
