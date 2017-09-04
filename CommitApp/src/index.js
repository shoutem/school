
import React, { Component } from 'react';

import { Screen, View } from '@shoutem/ui';
import UITheme from '@shoutem/ui/theme';
import { StyleProvider } from '@shoutem/theme';

import Commitment from './Commitment';

class App extends Component {
    render() {
        return (
            <StyleProvider style={theme}>
                <Screen>
                    <Commitment body={"build an app"} />
                </Screen>
            </StyleProvider>
        )
    }
}

const theme = Object.assign(UITheme(), {
    'CommitApp': {
        CircleButton: {
            '.green': {
                backgroundColor: 'limegreen',
                'shoutem.ui.Text': {
                    color: 'white'
                }
            }
        }
    }
})

export default App;
