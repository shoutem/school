
import React, { Component } from 'react';
import { View } from '@shoutem/ui';
import _ from 'lodash';

import { scaleLinear } from 'd3-scale';
import { mean } from 'd3-array';

const ACTIVE = 'rgba(255, 85, 0, 0.6)',
      INACTIVE = 'rgba(85, 85, 85, 0.3)';

class SoundCloudWave extends Component {
    state = {
        waveform: null
    }

    componentDidMount () {
        this.fetchWaveForm();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.waveform_url !== nextProps.song.waveform_url) {
            this.fetchWaveForm();
        }
    }

    fetchWaveForm() {
        const { waveform_url } = this.props.song;

        fetch(waveform_url)
          .then(res => res.json())
          .then(json => this.setState({
              waveform: json,
              waveform_url: waveform_url
          }));
    }

    color(bars, bar_n) {
        return bar_n/bars.length < this.props.percent ? ACTIVE : INACTIVE;
    }

    render() {
        if (!this.state.waveform) return null;

        const { waveform } = this.state,
              { percent } = this.props;

        let chunks = _.chunk(waveform.samples, waveform.width/(this.props.width/3)),
            height = scaleLinear().domain([0, waveform.height])
                                  .range([0, this.props.height]);

        return (
            <View styleName="horizontal" style={{width: this.props.width, height: this.props.height}}>
                {chunks.map((chunk, i) => (
                    <View style={{backgroundColor: this.color(chunks, i),
                                  width: 2,
                                  marginRight: 1,
                                  height: height(mean(chunk))}}
                    key={i}/>
                 ))}
            </View>);
    }
}

export default SoundCloudWave;
