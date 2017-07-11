
import React from 'react';
import { Linking } from 'react-native';
import { observer } from 'mobx-react';
import { TouchableOpacity, Heading, View, Subtitle, Icon, Text } from '@shoutem/ui';
import moment from 'moment';

import { Children } from './HNItem';

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

        <View>
            <Text>{item.text}</Text>
        </View>
    </View>
));

const Story = observer(({ item }) => (
    <View style={{paddingLeft: 14, paddingRight: 14}}>
        <Children item={item}
                  renderHeader={() => <StoryHeader item={item} />}/>
    </View>
));

export default Story;
