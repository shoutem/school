
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
    }

    constructor(props) {
        super(props);

        this.state = {
            items: props.items.map(item => {
                item.value = false;
                return item;
            })
        };
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

            console.log(items);

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

const ITEMS = {
    Toiletries: [
        {id: 0, name: 'Toothbrush'},
        {id: 1, name: 'Toothpaste'},
        {id: 2, name: 'Facewash'}
    ],
    Clothes: [
        {id: 0, name: 'Jacket'},
        {id: 1, name: 'T-Shirts'},
        {id: 2, name: 'Underpants'}
    ],
    Gear: [
        {id: 0, name: 'Laptop'},
        {id: 1, name: 'Book'},
        {id: 2, name: 'Phone Charger'}
    ]
}

const PackingScreen = TabNavigator({
    Toiletries: {
        screen: ({ navigation }) => <PackingList navigation={navigation} items={ITEMS.Toiletries} />,
        navigationOptions: {
            tabBarLabel: 'Toiletries',
            tabBarIcon: tabBarIcon(require('./images/toothbrush.png'))
        }
    },
    Clothes: {
        screen: ({ navigation }) => <PackingList navigation={navigation} items={ITEMS.Clothes} />,
        navigationOptions: {
            tabBarLabel: 'Clothes',
            tabBarIcon: tabBarIcon(require('./images/shirt.png'))
        }
    },
    Gear: {
        screen: ({ navigation }) => <PackingList navigation={navigation} items={ITEMS.Gear} />,
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
