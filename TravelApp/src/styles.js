
import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bigButtonText: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 }
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
  },
  header: {
      fontSize: 15,
      padding: 15,
      textAlign: 'center',
      fontWeight: '500'
  },
  packingList: {
      justifyContent: 'flex-start'
  },
  listItem: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: Dimensions.get('window').width,
      padding: 10
  },
  listItemText: {
      fontSize: 15,
      margin: 10
  },
  addItemContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: Dimensions.get('window').width
  },
  addItemInput: {
      height: 40,
      borderColor: 'lightgray',
      borderWidth: 1,
      flex: 1,
      padding: 5
  }
});

export default styles;
