
import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './styles';

class ClimatesScreen extends Component {
    static navigationOptions = {
        title: "Where you goin?"
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    This is a list of climates
                </Text>
            </View>
        );
    }
}

export default ClimatesScreen;
