
import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, ListView, Title, Tile, Subtitle } from '@shoutem/ui';

const Story =
inject('store')(observer(function Story({ store, id }) {
    const item = store.items.get(id);

    if (item) {
        return (
            <View>
                <Tile>
                    <Title>{item.title}</Title>
                    <Subtitle styleName="sm-gutter-horizontal">
                        {item.score}
                    </Subtitle>
                </Tile>
            </View>
        )
    }else{
        return (
            <View>
                <Title>Loading ... ({id})</Title>
            </View>
        )
    }
}));

const StoriesList =
inject('store')(observer(function StoriesList ({ store }) {
    return (
        <ListView data={store.topStories.slice()}
                  renderRow={id => <Story id={id} />} />
    )
}));

export default StoriesList;
