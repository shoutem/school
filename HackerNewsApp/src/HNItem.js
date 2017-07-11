
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text, Heading, Icon, Subtitle, Caption, ListView } from '@shoutem/ui';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';

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

        <Children item={item} />
    </View>
));

const Children = observer(({ item }) => {
    if (item.kids) {
        return (
            <View style={{paddingLeft: 7}}>
                <ListView data={item.kids.slice()}
                          renderRow={id => <HNItem id={id} />} />
            </View>
        )
    }else{
        return null;
    }
});

@observer
class Comment extends Component {
    state = {
        expanded: false
    }

    expand = () => this.setState({
        expanded: true
    });

    unexpand = () => this.setState({
        expanded: false
    });

    render() {
        const { item } = this.props,
              { expanded } = this.state;

        return (
            <View style={{paddingBottom: 20}}>
                {expanded
                 ? <HTMLView onPress={this.unexpand} value={item.text} />
                 : <HTMLView onPress={this.expand} numberOfLines={2} ellipsizeMode="tail" value={item.text} />}

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

                {expanded ? <Children item={item} /> : null}
            </View>
        );
    }
};

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
