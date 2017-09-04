
import React from 'react';

import { Text, TouchableOpacity } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

const CircleButton = ({ text, style, styleName }) => {
    return (
        <TouchableOpacity style={style.CircleButton} styleName={styleName}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
};

const style = {
    CircleButton: {
        width: 100,
        height: 100,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        'shoutem.ui.Text': {
            fontSize: 25
        }
    }
}

export default connectStyle('CommitApp', style)(CircleButton);
