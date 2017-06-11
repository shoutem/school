
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  bigButtonText: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'white'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'flex-end',
      opacity: .7
  }
});

export default styles;
