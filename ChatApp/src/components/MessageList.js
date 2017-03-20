
import React from 'react';
import {
    ListView, Text, Row, Image,
    View, Subtitle, Caption, Heading
} from '@shoutem/ui';
import moment from 'moment';

const Message = ({ msg }) => (
    <Row>
        <Image styleName="small-avatar top"
               source={{ uri: msg.author.avatar }} />
        <View styleName="vertical">
            <View styleName="horizontal space-between">
                <Subtitle>{msg.author.name}</Subtitle>
                <Caption>{moment(msg.time).from(Date.now())}</Caption>
            </View>
            <Text styleName="multiline">{msg.text}</Text>
        </View>
    </Row>
);

const MessageList = ({ messages }) => (
    <View>
        <Heading styleName="h-center" style={{paddingTop: 30}}>Global Chatroom</Heading>
        <ListView data={messages}
                  autoHideHeader={true}
                  renderRow={msg => <Message msg={msg} />}
                  />
    </View>
);

export default MessageList;
