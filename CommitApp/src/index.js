
import React, { Component } from 'react';

import { Screen, View, Image } from '@shoutem/ui';
import UITheme from '@shoutem/ui/theme';
import { StyleProvider } from '@shoutem/theme';

import Commitment from './Commitment';

class App extends Component {
    render() {
        return (
            <StyleProvider style={theme}>
                <Screen>
                    <Image styleName="background" source={require('./img/background.jpg')} />
                    <Commitment commitment={"build an app"} days={1} />
                </Screen>
            </StyleProvider>
        )
    }
}

const theme = Object.assign(UITheme(), {
    'shoutem.ui.Image': {
        '.background': {
            flex: 1,
            resizeMode: 'repeat',
            position: 'absolute'
        }
    },
    'shoutem.ui.Heading': {
        color: 'lightcyan',
        '.variable': {
            color: 'white'
        }
    },
    'shoutem.ui.Text': {
        color: 'lightcyan',
        '.variable': {
            color: 'white'
        }
    },
    'shoutem.ui.Title': {
        fontSize: 18,
        color: 'lightcyan',
        '.variable': {
            color: 'white'
        }
    },
    'CommitApp.Commitment': {
        text: {
            fontSize: 38,
            height: 50,
            lineHeight: 50,
        },
        textCommitment: {
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            'shoutem.ui.Heading': {
                fontSize: 38,
                height: 50,
                lineHeight: 50
            }
        }
    },
    'CommitApp.CircleButton': {
        '.green': {
            main: {
                backgroundColor: 'limegreen',
            },
            caption: {
                color: 'white'
            }
        },
    }
});



export default App;
