
import React, { Component } from 'react';
import { Image, View } from 'react-native';

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

        console.log(uri);

        return uri
             ? (<Image source={{uri: uri}} style={this.props.style} />)
             : (<Image style={this.props.style} />);
    }
}
