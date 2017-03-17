
import React from 'react';
import { ListView, Text, Row } from '@shoutem/ui';

const Message = ({ msg }) => (
    <Row>
        <Text>{msg.text}</Text>
    </Row>
);

const Messages = ({ messages }) => (
    <ListView data={messages}
              autoHideHeader={true}
              renderRow={msg => <Message msg={msg} />}
              />
);

export default Messages;
