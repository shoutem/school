
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, ListView, Text, Spinner } from '@shoutem/ui';

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
        return <Spinner />;
    }
});


const HNItem =
inject('store')(observer(function HNItem({ store, id }) {
    const item = store.items.get(id);

    if (!item || item.type === 'comment' && !item.sentiment.fetched) {
        return (<Spinner />);
    }

    if (item.type === 'story') {
        return (<Story item={item} />);
    }else if (item.type === 'comment') {
        if (item.sentiment.score < 0) {
            return null;
        }else{
            return (<Comment item={item} />);
        }
    }
}));

export default HNItem;
export { Children };
