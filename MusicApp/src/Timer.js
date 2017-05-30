

import React from 'react';
import { View, Text } from '@shoutem/ui';

const Timer = ({ currentTime }) => (
    <View styleName="horizontal h-end">
        <Text>{Math.floor(currentTime/60)} : {Math.floor(currentTime%60)}</Text>
    </View>
);

export default Timer;
