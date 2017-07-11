
import React from 'react';
import { Linking } from 'react-native';
import { observer } from 'mobx-react';
import { TouchableOpacity, Heading, View, Subtitle, Icon, Text } from '@shoutem/ui';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';

import { Children } from './HNItem';

const Story = observer(({ item }) => (
    <View style={{paddingLeft: 14, paddingRight: 14}}>
        <Children item={item}
                  renderHeader={() => <StoryHeader item={item} />}/>
    </View>
));

const StoryHeader = observer(({ item }) => (
    <View>
        <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
            <Heading>{item.title}</Heading>
        </TouchableOpacity>

        <View styleName="horizontal space-between" style={{paddingTop: 5}}>
            <Subtitle>
                <Icon style={{fontSize: 15}} name="like" />
                {item.score}
            </Subtitle>
            <Subtitle>
                <Icon style={{fontSize: 15}} name="friends" />
                {item.by}
            </Subtitle>
            <Subtitle>
                {moment.unix(item.time).fromNow()}
            </Subtitle>
        </View>

        {item.text ? <StoryText item={item} /> : null}
    </View>
));

const StoryText = observer(({ item }) => (
    <HTMLView value={item.text} style={{paddingBottom: 10, paddingTop: 5}} addLineBreaks={false} />
));

export default Story;
