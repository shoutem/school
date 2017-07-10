
import React from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text, Heading, Icon, Subtitle, Caption, ListView } from '@shoutem/ui';
import moment from 'moment';

const Story = observer(({ item }) => (
    <View style={{paddingLeft: 14, paddingRight: 14}}>
        <Heading>{item.title}</Heading>
        <View styleName="horizontal space-between" style={{paddingLeft: 5,
                                                           paddingRight: 5}}>
            <Subtitle>
                <Icon style={{fontSize: 15}} name="like" />
                {item.score}
            </Subtitle>
            <Subtitle>
                {moment.unix(item.time).fromNow()}
            </Subtitle>
        </View>
        <View>
            <Text>{item.text}</Text>
        </View>
        <View>
             <ListView data={item.kids.slice()}
                       renderRow={id => <HNItem id={id} />} />
        </View>
    </View>
));

const Comment = observer(({ item }) => (
    <View style={{paddingBottom: 20}}>
        <Text>{item.text}</Text>

        <View styleName="horizontal space-between" style={{paddingLeft: 5,
                                                           paddingRight: 5}}>
            <Caption>
                <Icon style={{fontSize: 15}} name="comment" />
                {item.by}
            </Caption>
            <Caption>
                {moment.unix(item.time).fromNow()}
            </Caption>
        </View>

        {item.kids ?
         <View style={{paddingLeft: 10, paddingTop: 5}}>
             <ListView data={item.kids.slice()}
                       renderRow={id => <HNItem id={id} />} />
         </View>
         : null}
    </View>
));

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
