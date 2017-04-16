
import React, { Component } from 'react';
import { Screen, Button, Text } from '@shoutem/ui';
import Camera from 'react-native-camera';
import { Surface } from "gl-react-native";

import HelloGL from './HelloGL';
import Saturate from './Saturate';

export default class App extends Component {
    state = {
        width: null,
        height: null,
        path: "https://i.imgur.com/uTP9Xfr.jpg"
    }

    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;

        this.setState({
            width,
            height
        });

        this.start();
    }

    refreshPic = () => {
        this.camera
            .capture({
                target: Camera.constants.CaptureTarget.temp,
                jpegQuality: 70
            })
            .then(data => this.setState({
                path: data.path
            }))
            .catch(err => console.error(err));
    }

    start() {
        this.timer = setInterval(() => this.refreshPic(),
                                 5);
    }

    onComponentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { width, height } = this.state;

        const filter = {
            contrast: 1,
            saturation: 1,
            brightness: 1
        }

        if (width && height) {
            return (
                <Screen onLayout={this.onLayout}>
                    <Camera style={{flex: 1}}
                            ref={cam => this.camera=cam}
                            captureQuality={Camera.constants.CaptureQuality["720p"]}
                            aspect={Camera.constants.Aspect.fill}>

                        <Surface style={{ width, height }}>
                            <Saturate {...filter}>
                                {{ uri: this.state.path }}
                            </Saturate>
                        </Surface>

                    </Camera>

                </Screen>
            );
        }else{
            return (
                <Screen onLayout={this.onLayout} />
            );
        }
    }
}
