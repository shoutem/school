
import React, { Component } from 'react';
import { Screen, Button, Text } from '@shoutem/ui';
import Camera from 'react-native-camera';
import GL, { Shaders, Node, GLSL } from 'gl-react';
import { Surface } from 'gl-react-native';

import timeLoop from './timeLoop';

const shaders = Shaders.create({
  helloGL: {
    frag: `
precision highp float;
varying vec2 uv; // This variable vary in all pixel position (normalized from vec2(0.0,0.0) to vec2(1.0,1.0))

void main () { // This function is called FOR EACH PIXEL
  gl_FragColor = vec4(uv.x, uv.y, 0.5, 0.5); // red vary over X, green vary over Y, blue is 50%, alpha is 100%.
}
    `
  },

  gradients: { frag: `
precision highp float;
varying vec2 uv;
uniform vec4 colors[3];
uniform vec2 particles[3];
void main () {
  vec4 sum = vec4(0.0);
  for (int i=0; i<3; i++) {
    vec4 c = colors[i];
    vec2 p = particles[i];
    float d = c.a * smoothstep(0.6, 0.2, distance(p, uv));
    sum += d * vec4(c.a * c.rgb, c.a);
  }
  if (sum.a > 1.0) {
    sum.rgb /= sum.a;
    sum.a = 1.0;
  }
  gl_FragColor = vec4(sum.a * sum.rgb, 1.0);
}
`}
});

const HelloGL = GL.createComponent(
    () => <GL.Node shader={shaders.helloGL} />,
    { displayName: 'HelloGL' }
);

const Gradients = ({ time }) =>
  <Node
    shader={shaders.gradients}
    uniforms={{
      colors: [
        [ Math.cos(0.002*time), Math.sin(0.002*time), 0.2, 1 ],
        [ Math.sin(0.002*time), -Math.cos(0.002*time), 0.1, 1 ],
        [ 0.3, Math.sin(3+0.002*time), Math.cos(1+0.003*time), 1 ]
      ],
      particles: [
        [ 0.3, 0.3 ],
        [ 0.7, 0.5 ],
        [ 0.4, 0.9 ]
      ]
    }}
  />;

const GradientsLoop = timeLoop(Gradients);

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
                        <Gradients time={new Date().getTime()}  />
                    </Surface>

                </Camera>
            </Screen>
        );
    }
}

export default App;
