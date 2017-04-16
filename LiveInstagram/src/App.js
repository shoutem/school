
import React, { Component } from 'react';
import { Screen } from '@shoutem/ui';
import Camera from 'react-native-camera';

import HelloGL from './HelloGL';

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

        console.log('render with', width, height);

        return (
            <Screen onLayout={this.onLayout}>
                <Camera style={{flex: 1}}
                        ref={cam => this.camera=cam}
                        aspect={Camera.constants.Aspect.fill}>
                    {width && height
                     ? <HelloGL width={width} height={height} />
                     : null}
                </Camera>
            </Screen>
        );
    }
}
