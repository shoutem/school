
import React from 'react';

import { View, Heading } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import CircleButton from './CircleButton';

const Commitment = ({ body }) => (
    <View styleName="lg-gutter" style={{paddingTop: 150}}>
        <View>
            <Heading>Did you</Heading>
            <Heading>{body}</Heading>
            <Heading>today?</Heading>
        </View>
        <View>
            <CircleButton styleName="green" text="Yes" />
        </View>
    </View>
);

export default Commitment;
