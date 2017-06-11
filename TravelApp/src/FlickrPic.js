
import React, { Component } from 'react';
import { Image, View } from 'react-native';

import Flickr from './flickrHelper';

export default class FlickrPic extends Component {
    state = {
        uri: null
    }

    componentDidMount() {
        Flickr(this.props.name).then(uri => this.setState({ uri }));
    }

    render() {
        const { uri } = this.state,
              { blurRadius } = this.props;

        return uri
             ? (<Image source={{uri: uri}} style={this.props.style} blurRadius={blurRadius || 0}  />)
             : (<Image style={this.props.style} />);
    }
}
