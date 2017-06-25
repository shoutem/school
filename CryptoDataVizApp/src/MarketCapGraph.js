
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from '@shoutem/ui';

import { initData } from './actions';

class MarketCapGraph extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(initData());
    }

    render() {
        return (
            <View>
            </View>
        );
    }
}

export default connect(state => state)(MarketCapGraph);
