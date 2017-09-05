
import React from 'react';

import { View, Heading, Title } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import CircleButton from './CircleButton';


const CommitmentDay = ({ done, style }) => (
    <View style={style} styleName={done ? 'done' : 'undone'}>

    </View>
);

const Commitment = ({ id, commitment, days, style }) => (
    <View style={style.main}>
        <View styleName="sm-gutter-top lg-gutter-left lg-gutter-right">
            <Heading style={style.text}>Did you</Heading>
            <View style={style.textCommitment}>
                <Heading styleName="variable">{commitment}</Heading>
            </View>
            <Heading style={style.text}>today?</Heading>
        </View>
        <View styleName="center xl-gutter-top lg-gutter-left lg-gutter-right">
            <CircleButton styleName="green large" text="Yes" />
        </View>
        <View styleName="center horizontal lg-gutter-top lg-gutter-left lg-gutter-right">
            <Title styleName="variable">{days}</Title><Title> {days === 1 ? 'day' : 'days'} in a row</Title>
        </View>
        <View styleName="horizontal md-gutter-top">
            {[...Array(50).keys()].map(i => <CommitmentDay done={i < 1} style={style.day} key={i} />)}
        </View>
    </View>
);

const style = {
    main: {
        backgroundColor: 'rgba(0,0,0,0)',
        paddingTop: 100
    },
    day: {
        height: 60,
        borderRadius: 10,
        flex: 1,
        margin: 1,
        '.done': {
            backgroundColor: 'rgba(255, 255, 255, .9)',
        },
        '.undone': {
            backgroundColor: 'rgba(255, 255, 255, .4)'
        }
    }
}

export default connectStyle('CommitApp.Commitment', style)(Commitment);
