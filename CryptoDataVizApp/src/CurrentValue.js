
import React from 'react';
import { connect } from 'react-redux';
import { View, Subtitle, Heading } from '@shoutem/ui';

const CurrentValue = connect(state => ({
    price: Object.values(state.prices)
                 .map(({ values }) => values[values.length-1] || 0)
                 .reduce((p, sum) => p+sum, 0)
}))(({ price }) => (
    <View>
        <Subtitle styleName="h-center">Current Crypto Value</Subtitle>
        <Heading styleName="h-center" style={{paddingTop: 10}}>
            ${price.toFixed(2)}
        </Heading>
    </View>
));

export default CurrentValue;
