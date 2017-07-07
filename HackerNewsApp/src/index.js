
import React, { Component } from 'react';
import { Screen } from '@shoutem/ui';
import { useStrict } from 'mobx';
import { Provider, observer } from 'mobx-react/native';

import Store from './Store';

useStrict(true);

@observer
class App extends Component {
    componentDidMount() {
        Store.listenForTopStories();
    }

    render() {
        return (
            <Provider stor={Store}>
                <Screen>
                    <StoriesList />
                </Screen>
            </Provider>
        )
    }
}

export default App;
