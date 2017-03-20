
import firebase from '../firebase';

const message = (state, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return {
                id: action.id,
                text: action.text
            }
        case 'SEND_MESSAGE':
            let msg = {
                text: action.text
            };

            const newMsgRef = firebase.database()
                                      .ref('messages')
                                      .push();
            msg.id = newMsgRef.key;
            newMsgRef.set(msg);

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
        case 'SEND_MESSAGE':
            return [
                ...state,
                message(undefined, action)
            ]
        default:
            return state
    }
};

export default messages;
