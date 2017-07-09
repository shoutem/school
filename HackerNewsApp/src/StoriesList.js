
import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, ListView, Subtitle, Caption, Spinner, Row, Icon, TouchableOpacity } from '@shoutem/ui';
import moment from 'moment';

const Story =
inject('store')(observer(function Story({ store, id }) {
    const item = store.items.get(id);

    if (item) {
        return (
            <TouchableOpacity onPress={() => store.openStory(id)}>
                <Row>
                    <View styleName="vertical">
                        <Subtitle>{item.title}</Subtitle>
                        <View styleName="horizontal space-between">
                            <Caption>
                                <Icon style={{fontSize: 15}} name="like" />
                                {item.score}
                            </Caption>
                            <Caption>
                                {moment.unix(item.time).fromNow()}
                            </Caption>
                        </View>
                    </View>
                    <Icon styleName="disclosure" name="right-arrow" />
                </Row>
             </TouchableOpacity>
        )
    }else{
        return (
            <Row styleName="small">
                <Caption>Loading ... ({id})</Caption>
            </Row>
        )
    }
}));

const StoriesList =
inject('store')(observer(function StoriesList ({ store, storyType }) {
    const stories = store.stories.get(storyType);

    if (stories) {
        return (
            <ListView data={stories.slice()}
                      renderRow={id => <Story id={id} />} />
        )
    }else{
        return <Spinner />
    }
}));

export default StoriesList;
