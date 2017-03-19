
import React, { Component } from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import ChatUI from './components/ChatUI';
import reducer from './reducers';

const store = createStore(reducer);

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <ChatUI />
            </Provider>
        );
    }
}

export default App;
