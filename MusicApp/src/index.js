
import React, { Component } from 'react';
import { Screen, Heading, NavigationBar, Title, Image } from '@shoutem/ui';

import radio from './media/radio_icon.png';

const Radio = () => (
    <Image source={radio}
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
