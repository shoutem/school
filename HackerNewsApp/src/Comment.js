
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TouchableOpacity, View, Caption, Icon, Text } from '@shoutem/ui';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';

import { Children } from './HNItem';

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

export default Comment;
