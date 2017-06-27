
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Heading, Subtitle, Divider, Text } from '@shoutem/ui';
import { Dimensions } from 'react-native';
import fromPairs from 'lodash.frompairs';
import groupBy from 'lodash.groupby';
import Svg, { G } from 'react-native-svg';
import * as d3 from 'd3';

import StreamGraph from './StreamGraph';

function chartValues(prices) {
    const products = Object.values(prices),
          keys = Object.keys(prices);

    if (!products.length) {
        return [];
    }

    const chunked = fromPairs(products.map(({ id, values }) =>
        [id,
         groupBy(values, val => {
             // round to 3 second accuracy
             const t = val.time.getTime();
             return Math.round(t/3000)*3000;
         })
        ]
    ));

    let [t0, t1] = d3.extent(
        Object.values(chunked)
              .reduce((arr, p) => arr.concat(Object.keys(p)), [])
              .map(t => new Date(Number(t)))
    );

    return d3.timeSeconds(t0, t1, 3)
             .map(t => fromPairs(
                 Object.keys(chunked)
                       .map(k => [k, (chunked[k][t.getTime()] || []).length])
                       .concat([['time', t]])
             ))
}


class TransactionVolumeGraph extends Component {


    render() {
        const { height, width } = Dimensions.get('window'),
              prices = this.props.prices;

        const values = chartValues(prices);

        return (
            <Svg height={height/2} width={width}>
                <StreamGraph keys={Object.keys(prices)}
                             values={values}
                             width={width}
                             height={height/2} />
            </Svg>
        );
    }
}

const Description = connect(state => ({
    times: Object.values(state.prices)
                 .reduce((arr, { values }) => arr.concat(values), [])
                 .map(({ time }) => time),
    prices: state.prices
}))(({ times, prices }) => {
    const [start, end] = d3.extent(times);

    if (!start) {
        return (
            <View styleName="horizontal h-center">
                <Text>Waiting for data</Text>
            </View>
        );
    }

    const avg = d3.mean(
        chartValues(prices).map(value => {
            const keys = Object.keys(value).filter(k => k !== 'time');
            return keys.reduce((sum, k) => sum+value[k], 0);
        }));

    const format = d3.timeFormat('%I:%M:%S');


    return (
        <View styleName="vertical h-center">
            <Text>Transaction volume since</Text>
            <Subtitle>{format(start)}</Subtitle>
            <Divider />
            <Text>Average {(avg || 0).toFixed(1)} every 3 seconds</Text>
        </View>
    )
});

export default connect(state => state)(TransactionVolumeGraph);

export { Description };
