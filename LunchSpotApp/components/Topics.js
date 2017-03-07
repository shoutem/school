
import React, { Component } from 'react';
import { View, Button, Text, Overlay, Heading } from '@shoutem/ui';

import styles from './styles';

const TOPICS = ['food', 'drinks', 'coffee', 'shops', 'sights', 'arts'];

const OverlayTopics = ({ onTopicSelect }) => (
    <Overlay styleName="fill-parent">
        <Heading style={{marginBottom: 15}}>What do you feel like?</Heading>
        {TOPICS.map(topic => (
            <Button onPress={() => onTopicSelect(topic)} key={topic} style={{marginBottom: 10}}>
                <Text>{topic}</Text>
            </Button>
        ))}
    </Overlay>
);

const BottomTopics = ({ onTopicSelect }) => (
    <View styleName="horizontal">
        {TOPICS.map(topic => (
            <Button onPress={() => onTopicSelect(topic)} key={topic} styleName="muted">
                <Text>{topic}</Text>
            </Button>
         ))}
    </View>
);

export { OverlayTopics, BottomTopics };
