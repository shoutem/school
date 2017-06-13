
import React, { Component, PureComponent } from 'react';
import { View, Text, FlatList, Switch, Button, TextInput } from 'react-native';

import styles from './styles';
import Store from './store';
import AddItem from './AddItem';

class ListItem extends PureComponent {
    _toggle = () => {
        this.props.onItemToggle(this.props.id)
    }

    _remove = () => {
        this.props.onRemoveItem(this.props.id);
    }

    render() {
        const { value, name } = this.props;

        return (
            <View style={styles.listItem}>
                <Switch value={value}
                        onValueChange={this._toggle} />
                <Text style={styles.listItemText}>{name}</Text>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <Button title="Remove"
                            onPress={this._remove}
                            style={{textAlign: 'right'}}/>
                </View>
            </View>
        )
    }
}

class PackingList extends PureComponent {
    state = {
        items: []
    }

    constructor(props) {
        super(props);

        this.getItems();
    }

    getItems = () => {
        const { navigation } = this.props;

        Store.getItems({ navigation })
             .then(items => {
                 this.setState({
                     items: items.map(item => {
                         if (typeof item.value === 'undefined') {
                             item.value = false;
                         }
                         return item;
                     })
                 });
             });
    }

    _clearItems = () => {
        const { navigation } = this.props;

        Store.clearItems({ navigation })
             .then(() => this.getItems());
    }

    _keyExtractor = (item, index) => item.id;

    _onItemToggle = (id) => {
        this.setState((state) => {
            const { navigation } = this.props;

            const items = state.items.map(
                item => {
                    item = Object.assign({}, item);
                    if (item.id === id) {
                        item.value = !item.value;
                    }
                    return item;
                }
            );

            Store.saveItems({ navigation, items });

            return { items };
        });
    }

    _onRemoveItem = (id) => {
        const { navigation } = this.props;

        Store.removeItem({ navigation, id })
             .then(this.getItems);
    }

    _renderItem = ({ item }) => (
        <ListItem id={item.id}
                  onItemToggle={this._onItemToggle}
                  onRemoveItem={this._onRemoveItem}
                  navigation={this.props.navigation}
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
                <AddItem navigation={navigation}
                         onAdd={this.getItems} />
                <Button title="Clear packing list"
                        onPress={this._clearItems} />
            </View>
        )
    }
}

export default PackingList;
