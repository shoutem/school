
import React, { Component } from 'react';
import { Screen, View, Heading, NavigationBar, Title, Image } from '@shoutem/ui';

//console.log();

import Genres from './Genres';

const Radio = () => (
    <Image source={require('./media/radio.png')}
           style={{width: 64, height: 64 }} />
);

const genres = ["Alternative Rock", "Ambient", "Classical", "Country"].map(name => (
    {name: name}
));

class App extends Component {

    render() {
        return (
            <Screen>
                <NavigationBar centerComponent={<Radio />}
                               onLayout={this.onNavigationBarLayout} />

                <View style={{paddingTop: 80}}>
                    <Heading styleName="h-center">
                        What do you feel like?
                    </Heading>

                    <Genres genres={genres} />
                </View>
            </Screen>
        )
    }
}

export default App;
