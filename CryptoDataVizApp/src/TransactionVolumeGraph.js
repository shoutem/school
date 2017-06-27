
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Heading, Divider } from '@shoutem/ui';
import { Dimensions } from 'react-native';
import fromPairs from 'lodash.frompairs';
import Svg from 'react-native-svg';

import StreamGraph from './StreamGraph';


class TransactionVolumeGraph extends Component {
    get chartValues() {
        const prices = this.props.prices,
              products = Object.values(prices),
              keys = Object.keys(prices);

        if (!products.length) {
            return [];
        }

        return products.map(({ values }) => values)
                       .reduce(
                           (long, cur) => long.length > cur.length
                                      ? long
                                      : cur,
                           products[0].values
                       ).map((_, i) =>
                           fromPairs(keys.map(
                               k => [k,
                                     ({price = 0} = prices[k].values[i] || {}).price || 0]
                           ))
                       );
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
