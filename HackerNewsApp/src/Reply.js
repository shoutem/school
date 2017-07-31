
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, TextInput, Button, Text, Spinner } from '@shoutem/ui';

@observer @inject('store')
class Reply extends Component {
    state = {
        text: "",
        submitting: false,
        error: null,
        replied: false
    }

    changeText = (text) => this.setState({
        text
    });

    submit = () => {
        const { submitting, text } = this.state,
              { store, id } = this.props;

        if (submitting) return;

        this.setState({
            submitting: true
        });

        store.reply(id, text)
             .then(result => {
                 console.log(result);

                 this.setState({
                     error: result.error,
                     replied: true,
                     submitting: false
                 });
             });
    }

    get submitStyle() {
        const { error } = this.state;

        if (error) {
            return {color: 'red'};
        }else{
            return null;
        }
    }

    render() {
        const { submitting, text, error, replied } = this.state;

        if (replied) return (<Text>{text}</Text>);

        return (
            <View styleName="vertical" style={{paddingTop: 5, paddingBottom: 10}}>
                <TextInput placeholder="Say something insightful"
                           onChangeText={this.changeText}
                           onSubmitEditing={this.submit}
                           value={text}
                           multiline={true}
                           returnKeyType="send"
                           style={{padding: 2, paddingLeft: 5, paddingRight: 5}}/>
                <Button onPress={this.submit}>
                    {submitting ? <Spinner /> : <Text style={this.submitStyle}>{error || "Submit"}</Text>}
                </Button>
            </View>
        );
    }
}

export default Reply;
