
import React, { Component } from 'react';
import { View, Heading, Title, TouchableOpacity, TextInput } from '@shoutem/ui';
import CircleButton from './CircleButton';

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

    _onCommit = () => {
        const { commitment, remindAt } = this.state;

        this.props.onCommit({
            commitment,
            remindAt
        });
    }

    render() {
        const { id, commitment, style } = this.props;

        return (
            <View style={style.main}>
                <View styleName="sm-gutter-top lg-gutter-left lg-gutter-right">
                    <Heading style={style.text}>I am going to</Heading>
                    <View style={style.textCommitment}>
                        <TextInput value={this.state.commitment}
                                   onChangeText={this.onChangeCommitment}
                                   autoCapitalize="none"
                                   style={style.input}
                                   autoFocus={true} />
                    </View>
                    <Heading style={style.text}>every day</Heading>
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
                    <CircleButton styleName="green large" text="Commit" onPress={this._onCommit} />
                </View>
            </View>
        )
    }
}

export default EditingCommitment;
