
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { View, Heading, Title, TouchableOpacity, TextInput } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import CircleButton from './CircleButton';


const CommitmentDay = ({ done, style }) => (
    <View style={style} styleName={done ? 'done' : 'undone'}>

    </View>
);

const DisplayCommitment = ({ id, commitment, days, onEdit, style }) => (
    <View style={style.main}>
        <View styleName="sm-gutter-top lg-gutter-left lg-gutter-right">
            <Heading style={style.text}>Did you</Heading>
            <TouchableOpacity style={style.textCommitment} onPress={onEdit}>
                <Heading styleName="variable">{commitment}</Heading>
            </TouchableOpacity>
            <Heading style={style.text}>today?</Heading>
        </View>
        <View styleName="center xl-gutter-top lg-gutter-left lg-gutter-right">
            <CircleButton styleName="green large" text="Yes" />
        </View>
        <View styleName="center horizontal xl-gutter-top lg-gutter-left lg-gutter-right">
            <Title styleName="variable">{days}</Title><Title> {days === 1 ? 'day' : 'days'} in a row</Title>
        </View>
        <View styleName="horizontal md-gutter-top">
            {[...Array(50).keys()].map(i => <CommitmentDay done={i < 1} style={style.day} key={i} />)}
        </View>
    </View>
);

class EditingCommitment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            commitment: props.commitment,
            remindAt: props.remindAt
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.commitment !== nextProps.commitment) {
            this.setState({
                commitment: nextProps.commitment
            })
        }
        if (this.props.remindAt !== nextProps.remindAt) {
            this.setState({
                remindAt: nextProps.remindAt
            })
        }
    }

    onChangeCommitment = (commitment) => { this.setState({ commitment }) }
    onChangeRemindAt = (remindAt) => { this.setState({ remindAt }) }

    render() {
        const { id, commitment, style } = this.props;

        return (
            <View style={style.main}>
                <View styleName="sm-gutter-top lg-gutter-left lg-gutter-right">
                    <Heading style={style.text}>Did you</Heading>
                    <View style={style.textCommitment}>
                        <TextInput value={this.state.commitment}
                                   onChangeText={this.onChangeCommitment}
                                   autoCapitalize="none"
                                   style={style.input}
                                   autoFocus={true} />
                    </View>
                    <Heading style={style.text}>today?</Heading>
                </View>
                <View styleName="lg-gutter-top lg-gutter-left lg-gutter-right">
                    <View styleName="horizontal">
                        <Heading style={style.smallText}>Remind me at</Heading>
                        <View style={style.smallInput}>
                            <TextInput value={this.state.remindAt}
                                       onChangeText={this.onChangeRemindAt}
                                       autoCapitalize="none" />
                        </View>
                    </View>
                    <Heading style={style.smallText}>just in case I forget.</Heading>
                </View>
                <View styleName="center xl-gutter-top lg-gutter-left lg-gutter-right">
                    <CircleButton styleName="green large" text="Commit" />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state, { id }) => ({
    commitment: state.commitments[id]
});

class Commitment extends Component {
    state = {
        editing: false
    }

    onEdit = () => this.setState({
        editing: true
    })

    render() {
        const { editing } = this.state,
              { commitment, style } = this.props;

        if (editing) {
            return (<EditingCommitment {...commitment} style={style} />)
        }else{
            return (<DisplayCommitment {...commitment} style={style} onEdit={this.onEdit} />)
        }
    }
}

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
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fontSize: 38,
        height: 50,
        lineHeight: 50,
        color: 'white',
        padding: 0
    },
    smallInput: {
        width: 150,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        paddingLeft: 5,
        'shoutem.ui.TextInput': {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            width: 150,
            fontSize: 24,
            height: 30,
            lineHeight: 30,
            padding: 0,
            color: 'white'
        }
    },
    text: {
        fontSize: 38,
        height: 50,
        lineHeight: 50,
    },
    textCommitment: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        'shoutem.ui.Heading': {
            fontSize: 38,
            height: 50,
            lineHeight: 50
        }
    },
    smallText: {
        fontSize: 24,
        height: 30,
        lineHeight: 30
    }
}

export default connectStyle('CommitApp.Commitment', style)(connect(mapStateToProps)(Commitment));
