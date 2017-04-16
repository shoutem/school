
import React, { Component } from 'react';
import { Screen } from '@shoutem/ui';
import Camera from 'react-native-camera';
import { Surface } from "gl-react-native";

import HelloGL from './HelloGL';
import Saturate from './Saturate';

export default class App extends Component {
    state = {
        width: null,
        height: null
    }

    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;

        this.setState({
            width,
            height
        });
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
                            aspect={Camera.constants.Aspect.fill}>

                        <Surface style={{ width, height }}>
                            <Saturate {...filter}>
                                {{ uri: "https://i.imgur.com/uTP9Xfr.jpg" }}
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
