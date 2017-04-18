
import React, { Component } from 'react';
import { Screen, Button, Text } from '@shoutem/ui';
import Camera from 'react-native-camera';
import { Surface } from "gl-react-native";
import { PanResponder } from 'react-native';
import { scaleLinear } from 'd3-scale';

import HelloGL from './HelloGL';
import Saturate from './Saturate';

export default class App extends Component {
    state = {
        width: null,
        height: null,
        path: "https://i.imgur.com/uTP9Xfr.jpg",
        contrast: 1,
        brightness: 1,
        saturation: 1
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
                                 8);
    }

    dragScaleX = scaleLinear()
    dragScaleY = scaleLinear()

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (e, {x0, y0}) => {
                const { width, height } = this.state;

                this.dragScaleX
                    .domain([-x0, width-x0])
                    .range([-1, 1]);

                this.dragScaleY
                    .domain([-y0, height-y0])
                    .range([1, -1]);
            },

            onPanResponderMove: (e, {dx, dy}) => {
                this.setState({
                    saturation: 1 + this.dragScaleX(dx),
                    brightness: 1 + this.dragScaleY(dy)
                });
            },

            onPanResponderRelease: (ev, {vx, vy}) => {
                console.log('released');
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { width, height, brightness, contrast, saturation } = this.state;

        const filter = {
            brightness,
            contrast,
            saturation
        }

        if (width && height) {
            return (
                <Screen onLayout={this.onLayout}
                        {...this._panResponder.panHandlers}>
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
