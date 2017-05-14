
import React, { Component } from 'react';
import { Screen, Heading, NavigationBar, Title, Image } from '@shoutem/ui';

const Radio = () => (
    <Image source={require('./media/radio.png')}
           style={{width: 64, height: 64 }} />
);

class App extends Component {
    render() {
        return (
            <Screen>
                <NavigationBar centerComponent={<Radio />} />
            </Screen>
        )
    }
}

export default App;
