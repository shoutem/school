
import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, ListView, Title, Tile, Subtitle, Spinner } from '@shoutem/ui';
import moment from 'moment';

const Story =
inject('store')(observer(function Story({ store, id }) {
    const item = store.items.get(id);

    if (item) {
        return (
            <View>
                <Tile>
                    <Title>{item.title}</Title>
                    <Subtitle styleName="sm-gutter-horizontal">
                        {item.score} {moment.unix(item.time).fromNow()}
                    </Subtitle>
                </Tile>
            </View>
        )
    }else{
        return (
            <View>
                <Tile>
                    <Subtitle>Loading ... ({id})</Subtitle>
                </Tile>
            </View>
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
