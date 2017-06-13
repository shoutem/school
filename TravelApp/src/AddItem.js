
import React, { Component } from 'react';
import { View, TextInput, Button } from 'react-native';

import styles from './styles';
import Store from './store';

class AddItem extends Component {
    static placeholder = 'New item name ...'

    constructor(props) {
        super(props);
        this.state = { text: AddItem.placeholder }
    }

    _onChangeText = (text) => this.setState({ text });

    _addItem = () => {
        const { text } = this.state,
              { navigation } = this.props;

        if (text !== AddItem.placeholder) {
            Store.addItem({ navigation, text })
                 .then(() => {
                     if (this.props.onAdd) {
                         this.props.onAdd();
                     }
                 });

            this.setState({ text: AddItem.placeholder });
        }
    }

    _onFocus = () => {
        const { text } = this.state;

        if (text === AddItem.placeholder) {
            this.setState({
                text: ''
            });
        }
    }

    _onBlur = () => {
        const { text } = this.state;

        if (text === '') {
            this.setState({
                text: AddItem.placeholder
            });
        }
    }

    render() {
        return (
            <View style={styles.addItemContainer}>
                <TextInput style={styles.addItemInput}
                           onChangeText={this._onChangeText}
                           value={this.state.text}
                           onFocus={this._onFocus}
                           onSubmitEditing={this._addItem}
                           autoCapitalize="words" />
                <Button title="Add item"
                        onPress={this._addItem} />
            </View>
        );
    }
}

export default AddItem;
