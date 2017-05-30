
import React, { Component } from 'react';
import { View } from '@shoutem/ui';
import _ from 'lodash';

import { scaleLinear } from 'd3-scale';
import { mean } from 'd3-array';

class SoundCloudWave extends Component {
    state = {
        waveform: null
    }

    componentDidMount () {
        const { waveform_url } = this.props.song;

        fetch(waveform_url)
          .then(res => res.json())
          .then(json => this.setState({
              waveform: json
          }));
    }

    render() {
        if (!this.state.waveform) return null;

        const { waveform } = this.state;

        let chunks = _.chunk(waveform.samples, waveform.width/(this.props.width/4)),
            height = scaleLinear().domain([0, waveform.height])
                                  .range([0, this.props.height]);

        return (
            <View styleName="horizontal" style={{width: this.props.width, height: this.props.height}}>
                {chunks.map((chunk, i) => (
                    <View style={{backgroundColor: '#f50',
                                  backgroundOpacity: 0.8,
                                  width: 3,
                                  marginRight: 1,
                                  height: height(mean(chunk))}}
                    key={i}/>
                 ))}
            </View>);
    }
}

export default SoundCloudWave;
