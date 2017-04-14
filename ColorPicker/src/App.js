
import React, { Component } from 'react';
import { Screen, Button, Text } from '@shoutem/ui';
import Camera from 'react-native-camera';
import GL from 'gl-react';
import { Surface } from 'gl-react-native';

const shaders = GL.Shaders.create({
  helloGL: {
    frag: `
precision highp float;
varying vec2 uv; // This variable vary in all pixel position (normalized from vec2(0.0,0.0) to vec2(1.0,1.0))

void main () { // This function is called FOR EACH PIXEL
  gl_FragColor = vec4(uv.x, uv.y, 0.5, 0.5); // red vary over X, green vary over Y, blue is 50%, alpha is 100%.
}
    `
  }
});

const HelloGL = GL.createComponent(
    () => <GL.Node shader={shaders.helloGL} />,
    { displayName: 'HelloGL' }
);

class App extends Component {
    state = {
        width: 300,
        height: 300
    }

    takePicture = () => {
        this.camera.capture({
            captureTarget: Camera.constants.CaptureTarget.temp
        })
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }

    onCameraLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;

        this.setState({
            width,
            height
        })
    }

    render() {
        const { width, height } = this.state;

        return (
            <Screen>
                <Camera ref={cam => this.camera = cam}
                        style={{flex: 1, alignItems: 'center'}}
                        onLayout={this.onCameraLayout}>

                    <Surface width={width} height={height}>
                        <HelloGL  />
                    </Surface>

                </Camera>
            </Screen>
        );
    }
}

export default App;
