
import React, { PureComponent } from 'react';
import { View, Text, FlatList, Switch } from 'react-native';

import styles from './styles';
import Store from './store';

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
        items: []
    }

    constructor(props) {
        super(props);

        const { navigation } = props;

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

export default PackingList;
