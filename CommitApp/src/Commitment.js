
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { Dimensions } from 'react-native';

import { updateCommitment, doneCommitment } from './actions';
import EditingCommitment from './EditingCommitment';
import DisplayCommitment from './DisplayCommitment';


const mapStateToProps = (state, { id }) => ({
    commitment: state.commitments[id]
});

const mapDispatchToProps = (dispatch, { id }) => ({
    update: ({ commitment, remindAt }) => dispatch(updateCommitment({ commitment, remindAt, id })),
    done: () => dispatch(doneCommitment({ id }))
});

class Commitment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: props.id === 'ADD'
        }
    }

    onEdit = () => { this.setState({
        editing: true
    }) }

    onCommit = ({ commitment, remindAt }) => {
        this.props.update({ commitment, remindAt });
        this.setState({
            editing: false
        });
    }

    onDone = () => {
        this.props.done();
    }

    render() {
        const { editing } = this.state,
              { commitment, style } = this.props;

        if (editing) {
            return (<EditingCommitment {...commitment} style={style} onCommit={this.onCommit} />)
        }else{
            return (<DisplayCommitment {...commitment}
                                       style={style}
                                       onEdit={this.onEdit}
                                       onDone={this.onDone} />)
        }
    }
}

const style = {
    main: {
        backgroundColor: 'rgba(0,0,0,0)',
        paddingTop: 100,
        width: Dimensions.get('window').width
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

export default connectStyle('CommitApp.Commitment', style)(
    connect(mapStateToProps, mapDispatchToProps)(Commitment)
);
