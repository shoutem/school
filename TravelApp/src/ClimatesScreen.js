
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';

import styles from './styles';
import FlickrPic from './FlickrPic';

class Climate extends Component {

    render() {
        const { name } = this.props,
              { width } = Dimensions.get('window');

        return (
            <View style={styles.container}>
                <FlickrPic name={`${name} climate scene`} style={[styles.backgroundImage, { width }]} />
                <Text style={[styles.bigButtonText, {position: 'absolute'}]}>
                    {name}
                </Text>
            </View>
        );
    }
}

class ClimatesScreen extends Component {
    static navigationOptions = {
        title: "Where you goin?"
    }

    static Climates = ["Tropical", "Dry", "Moderate", "Continental", "Polar"]

    render() {
        const { Climates } = this.constructor;

        return (
            <View style={styles.container}>
                {Climates.map(climate => <Climate name={climate} key={climate} />)}
            </View>
        );
    }
}

export default ClimatesScreen;
