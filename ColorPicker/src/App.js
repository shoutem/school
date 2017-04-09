
import React, { Component } from 'react';
import { Screen, Button, Text } from '@shoutem/ui';
import Camera from 'react-native-camera';

class App extends Component {
    takePicture = () => {
        this.camera.capture({
            captureTarget: Camera.constants.CaptureTarget.temp
        })
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }

    render() {
        return (
            <Screen>
                <Camera ref={cam => this.camera = cam}
                        style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>

                </Camera>
                <Button onPress={this.takePicture}><Text>Click</Text></Button>
            </Screen>
        );
    }
}

export default App;
