
const message = (state, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return {
                id: action.id,
                text: action.text
            }
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
