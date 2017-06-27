
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Heading, Divider } from '@shoutem/ui';
import { Dimensions } from 'react-native';
import fromPairs from 'lodash.frompairs';
import groupBy from 'lodash.groupby';
import Svg from 'react-native-svg';
import * as d3 from 'd3';

import StreamGraph from './StreamGraph';


class TransactionVolumeGraph extends Component {
    get chartValues() {
        const prices = this.props.prices,
              products = Object.values(prices),
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

        const [t0, t1] = d3.extent(
            Object.values(chunked)
                  .reduce((arr, p) => arr.concat(Object.keys(p)), [])
                  .map(t => new Date(Number(t)))
        );

        return d3.timeSeconds(t0, t1, 3)
                 .map(t => fromPairs(
                     Object.keys(chunked)
                           .map(k => [k, (chunked[k][t.getTime()] || []).length])
                 ))
    }

    render() {
        const { width } = Dimensions.get('window'),
              prices = this.props.prices;

        return (
            <Svg height="500" width={width}>
                <StreamGraph keys={Object.keys(prices)}
                             values={this.chartValues}
                             width={width}
                             height={300} />
            </Svg>
        );
    }
}

export default connect(state => state)(TransactionVolumeGraph);
