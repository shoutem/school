

import React from 'react';

export const Timer = ({ currentTime }) => (
    <View styleName="horizontal h-end">
        <Text>{Math.floor(currentTime/60)} : {Math.floor(currentTime%60)}</Text>
    </View>
);
