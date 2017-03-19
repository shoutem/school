
let nextMessageId = 0;

export const addMessage = (text) => ({
    type: 'ADD_MESSAGE',
    id: nextMessageId++,
    text
});
