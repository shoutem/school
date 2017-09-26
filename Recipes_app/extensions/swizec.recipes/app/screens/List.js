import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class List extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Recipes list!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
