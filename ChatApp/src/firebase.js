
import * as firebase from 'firebase';

// should go in a secret file
const config = {
    apiKey: "AIzaSyDLFqbBXZJKo-GTtqWCWtDgmENuy4uaHpQ",
    authDomain: "chatapp-6c33c.firebaseapp.com",
    databaseURL: "https://chatapp-6c33c.firebaseio.com",
    storageBucket: "chatapp-6c33c.appspot.com",
    messagingSenderId: "566006872694"
};
firebase.initializeApp(config);

export default firebase;
