
import React, { Component } from 'react';
import { Screen, View, Heading, NavigationBar, Title, Image } from '@shoutem/ui';

//console.log();

import Genres from './Genres';

const Radio = () => (
    <Image source={require('./media/radio.png')}
           style={{width: 64, height: 64 }} />
);

const genres = ["Alternative Rock", "Ambient", "Classical", "Country", "EDM",
                "Dancehall", "Deep House", "Disco", "Drum & Bass", "Dubstep", "Electronic",
                "Folk", "Singer-Songwriter", "Rap", "House", "Indie", "Jazz & Blues",
                "Latin", "Metal", "Piano", "Pop", "R&B & Soul", "Reggae", "Reggaeton",
                "Rock", "Soundtrack", "Techno", "Trance", "Trap", "Triphop"].map(name => (
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
