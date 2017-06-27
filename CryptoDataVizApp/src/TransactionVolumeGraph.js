
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import Svg from 'react-native-svg';

import StreamGraph from './StreamGraph';
import { chartValues } from './helpers';


const TransactionVolumeGraph = connect(state => state)(
    ({ prices }) => {
        const { height, width } = Dimensions.get('window');
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
);

export default TransactionVolumeGraph;
