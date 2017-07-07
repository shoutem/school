
import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, ListView, Title } from '@shoutem/ui';

const Story =
inject('store')(observer(function Story({ store, id }) {
    const item = store.items[id];

    if (item) {
        return (
            <View>
                <Title>{item.title}</Title>
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
