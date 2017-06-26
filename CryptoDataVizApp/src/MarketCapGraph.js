
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Heading, Divider } from '@shoutem/ui';
import { Dimensions } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import fromPairs from 'lodash.frompairs';
import * as d3 from 'd3';

import { initData } from './actions';

const TotalPrice = connect(state => ({
    price: Object.values(state.prices)
                 .map(({ values }) => values[values.length-1] || 0)
                 .reduce((p, sum) => p+sum, 0)
}))(({ price }) => (
    <Heading styleName="h-center" style={{paddingTop: 10}}>${price.toFixed(2)}</Heading>
));

const StackChart = ({ keys, values, width, height }) => {
    const stack = d3.stack()
                    .keys(keys)
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetSilhouette),
          series = stack(values);

    if (!series.length) {
        return null;
    }

    const colors = d3.schemeCategory20c,
          y = d3.scaleLinear()
                .domain([
                    d3.min(series[0].map(([y0, y1]) => y0)),
                    d3.max(series[series.length-1].map(([y0, y1]) => y1))
                ])
                .range([0, height]),
          x = d3.scaleLinear()
                .domain([0, series[0].length])
                .range([0, width]);

    const area = d3.area()
                   .y0(([y0, y1]) => 150+y(y0))
                   .y1(([y0, y1]) => 150+y(y1))
                   .x((d, i) => x(i));

    return (
        <G>
            {series.map((s, i) => (
                <Path d={area(s)}
                      fill={colors[8+i]}
                      key={keys[i]}
                      />
            ))}
        </G>
    );
};


class MarketCapGraph extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(initData());
    }

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
                               k => [k, prices[k].values[i] || 0]
                           ))
                       );
    }

    render() {
        const { width } = Dimensions.get('window'),
              prices = this.props.prices;

        return (
            <View>
                <TotalPrice />

                <Svg height="500" width={width}>
                    <StackChart keys={Object.keys(prices)}
                                values={this.chartValues}
                                width={width}
                                height={300} />
                </Svg>
            </View>
        );
    }
}

export default connect(state => state)(MarketCapGraph);
