
import React from 'react';

import { Text, TouchableOpacity } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';

const CircleButton = ({ text, style, onPress, styleName }) => (
    <TouchableOpacity style={style.main} onPress={onPress}>
        <Text style={style.caption}>{text}</Text>
    </TouchableOpacity>
);

const style = {
    main: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    '.large': {
        main: {
            width: 150,
            height: 150,
            borderRadius: 150,
        },
        caption: {
            fontSize: 35
        }
    },
    '.small': {
        main: {
            width: 80,
            height: 80,
            borderRadius: 80,
        },
        caption: {
            fontSize: 25
        }
    }
}

export default connectStyle('CommitApp.CircleButton', style)(CircleButton);
