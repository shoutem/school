
import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableHighlight } from 'react-native';

import styles from './styles';
import FlickrPic from './FlickrPic';

class Choice extends Component {
    onPress = (event) => {
        this.props.navigate(this.props.name);
    }

    render() {
        const { name, flickrSearch } = this.props,
              { width } = Dimensions.get('window');

        return (
            <TouchableHighlight style={styles.container}
                                onPress={this.onPress}>
                <View style={styles.container}>
                    <FlickrPic name={flickrSearch(name)}
                               style={[styles.backgroundImage, { width }]}
                               blurRadius={1.2} />
                    <Text style={[styles.bigButtonText, {position: 'absolute'}]}>
                        {name}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const ListScreen = ({ navigate, choices, flickrSearch }) => (
    <View style={styles.container}>
        {choices.map(choice => <Choice name={choice} key={choice} navigate={navigate} flickrSearch={flickrSearch} />)}
    </View>
)

export default ListScreen;
