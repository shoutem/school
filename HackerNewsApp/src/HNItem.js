
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text, Heading, Icon, Subtitle, Caption, ListView, TouchableOpacity } from '@shoutem/ui';
import { Linking } from 'react-native';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';

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

const ChildrenToggle = observer(({ item, showChildren, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <View styleName="horizontal h-end">
            <Caption>
                <Icon style={{fontSize: 12, paddingRight: 5}} name="comment" />
                {item.kids.length} {item.kids.length > 1 ? 'replies' : 'reply'}
                <Icon style={{fontSize: 8}} name={showChildren ? 'down-arrow' : 'right-arrow'}  />
            </Caption>
        </View>
    </TouchableOpacity>
));

@observer
class Comment extends Component {
    state = {
        showChildren: false,
        expanded: false
    }

    expand = () => this.setState({
        expanded: true
    });

    unexpand = () => this.setState({
        expanded: false
    });

    toggleChildren = () => this.setState({
        showChildren: !this.state.showChildren
    });

    render() {
        const { item } = this.props,
              { showChildren, expanded } = this.state,
              { kids = [] } = item;

        return (
            <View style={{paddingBottom: 20}}>
                <View styleName="horizontal space-between" style={{paddingTop: 5}}>
                    <Caption>
                        <Icon style={{fontSize: 15}} name="friends" />
                        {item.by}
                    </Caption>
                    <Caption>
                        {moment.unix(item.time).fromNow()}
                    </Caption>
                </View>

                {expanded
                 ? <HTMLView onPress={this.unexpand} value={item.text} />
                 : <HTMLView onPress={this.expand} value={item.text} />}

                {kids.length ? <ChildrenToggle item={item} showChildren={showChildren} onPress={this.toggleChildren} /> : null}

                {showChildren ? <Children item={item} /> : null}
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
