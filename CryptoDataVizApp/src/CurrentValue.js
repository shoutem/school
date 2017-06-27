
import React from 'react';
import { connect } from 'react-redux';
import { View, Subtitle, Heading, Text } from '@shoutem/ui';
import last from 'lodash.last';

const CurrentValue = connect(state => ({
    all: Object.values(state.prices)
               .map(({ values }) => last(values) || {price: 0})
               .reduce((sum, { price }) => sum+price, 0),
    btc: last(({ values = [] } = state.prices['BTC-USD'] || {}).values) || {price: 0},
    eth: last(({ values = [] } = state.prices['ETH-USD'] || {}).values) || {price: 0},
    ltc: last(({ values = [] } = state.prices['LTC-USD'] || {}).values) || {price: 0}
}))(({ all, btc, eth, ltc }) => (
    <View>
        <Subtitle styleName="h-center">Current Crypto Value</Subtitle>
        <Heading styleName="h-center" style={{paddingTop: 10}}>
            ${all.toFixed(2)}
        </Heading>
        <View styleName="horizontal h-center space-between" style={{paddingLeft: 20,
                                                                   paddingRight: 20}}>
            <Text>BTC: ${btc.price.toFixed(2)}</Text>
            <Text>ETH: ${eth.price.toFixed(2)}</Text>
            <Text>LTC: ${ltc.price.toFixed(2)}</Text>
        </View>
    </View>
));

export default CurrentValue;
