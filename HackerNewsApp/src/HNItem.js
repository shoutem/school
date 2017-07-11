
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, ListView, Text } from '@shoutem/ui';

import Comment from './Comment';
import Story from './Story';


const Children = observer(({ item, renderHeader = () => null }) => {
    if (item.kids) {
        return (
            <View style={{paddingLeft: 12}}>
                <ListView data={item.kids.slice()}
                          renderRow={id => <HNItem id={id} />}
                          renderHeader={renderHeader} />
            </View>
        )
    }else{
        return null;
    }
});


const HNItem =
inject('store')(observer(function HNItem({ store, id }) {
    const item = store.items.get(id);

    if (!item) {
        return (<Text>Loading ...</Text>);
    }

    if (item.type === 'story') {
        return (<Story item={item} />);
    }else if (item.type === 'comment') {
        return (<Comment item={item} />);
    }
}));

export default HNItem;
export { Children };
