
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

const message = (state, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            const msg = {
                id: action.id,
                text: action.text
            };

            firebase.database()
                    .ref(`messages/${action.id}`)
                    .set(msg);

            return msg;
        default:
            return state
    }
}

const messages = (state = [], action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return [
                ...state,
                message(undefined, action)
            ]
        default:
            return state
    }
};

export default messages;
