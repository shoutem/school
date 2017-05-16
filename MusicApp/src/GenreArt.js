
import React, { Component } from 'react';
import { Card, Image, Subtitle, Spinner } from '@shoutem/ui';

import Flickr from './flickrHelper';

export default class GenreArt extends Component {
    state = {
        uri: null
    }

    componentDidMount() {
        Flickr(this.props.name).then(uri => this.setState({ uri }));
    }

    render() {
        const { uri } = this.state;

        if (uri) {
            return (
                <Card styleName="flexible">
                    <Image source={{uri: uri}} styleName="medium-wide" />
                    <Subtitle numberOfLines={1}>{this.props.name}</Subtitle>
                </Card>
            );
        }else{
            return (
                <Card styleName="flexible">
                    <Spinner styleName="large" style={{paddingTop: 30,
                                                       paddingBottom: 30}}/>
                    <Subtitle numberOfLines={1}>{this.props.name}</Subtitle>
                </Card>
            );
        }
    }
}
