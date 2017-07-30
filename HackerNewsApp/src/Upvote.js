
import React, { Component } from 'react';
import { Icon, Spinner } from '@shoutem/ui';
import { observer, inject } from 'mobx-react';

@inject('store') @observer
class Upvote extends Component {
    state = {
        upvoting: false,
        upvoted: false
    }

    upvote = () => {
        const { id, store } = this.props,
              { upvoting, upvoted } = this.state;

        if (upvoting || upvoted) return;

        this.setState({
            upvoting: true
        });

        store.upvote(id)
             .then(success => {
                 this.setState({
                     upvoted: success,
                     upvoting: false
                 });
             });
    }

    render() {
        const { upvoting, upvoted } = this.state;

        if (upvoting) {
            return (<Spinner style={{width: 10, height: 10, size: "small"}} />);
        }else{
            return (
                <Icon style={{fontSize: 15, opacity: upvoted ? 0.3 : 1}}
                      name="like"
                      onPress={this.upvote} />
            )
        }
    }
}

export default Upvote;
