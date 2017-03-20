
import React from 'react';
import { connect } from 'react-redux';
import { View, Spinner } from '@shoutem/ui';

import MessageList from '../components/MessageList';

const mapStateToProps = (state) => ({
    messages: state.chatroom.messages,
    isFetching: state.chatroom.meta.isFetching
});

const Messages = connect(
    mapStateToProps
)(({ messages, isFetching }) => {
    if (isFetching) {
        return (
            <View style={{paddingTop: 100}}>
                <Spinner />
            </View>
        )
    }else{
        return <MessageList messages={messages} />
    }
});

export default Messages;
