
import React, { Component } from 'react';
import { Image, View } from '@shoutem/ui';

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

        return uri
             ? (<Image source={{uri: uri}} styleName="medium-wide" />)
             : (<View style={{paddingTop: 85}} />);
    }
}
