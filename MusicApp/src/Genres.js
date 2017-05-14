
import React, { Component } from 'react';
import { ListView, GridView, GridRow, TouchableOpacity, Card, Image, View, Subtitle, Spinner } from '@shoutem/ui';

import Flickr from 'flickr-sdk';

const flickr = new Flickr({
    apiKey: "8dacb3c2a9b8ff4016fab4a76df1441c",
    apiSecret: "47a16c5f9512dbf8"
});

class GenreArt extends Component {
    state = {
        uri: null
    }

    componentDidMount() {

    }

    render() {
        const { uri } = this.state;

        if (uri) {
            return (
                <Card styleName="flexible">
                    <Image source={{uri: uri}} styleName="medium-wide" />
                </Card>
            );
        }else{
            return (
                <Card styleName="flexible">
                    <Spinner />
                </Card>
            );
        }
    }
}

class Genres extends Component {
    renderRow(rowData, sectionId, index) {
        const cellViews = rowData.map((genre, id) => (
            <TouchableOpacity key={id} styleName="flexible">
                <View>
                    <GenreArt />
                    <View styleName="content">
                        <Subtitle numberOfLines={1}>{genre.name}</Subtitle>
                    </View>
                </View>
            </TouchableOpacity>
        ));

        return (
            <GridRow columns={2}>
                {cellViews}
            </GridRow>
        )
    }

    render() {
        const groupedGenres = GridRow.groupByRows(this.props.genres, 2);

        console.log(groupedGenres);

        return (
            <ListView data={groupedGenres}
                      renderRow={this.renderRow} />
        )
    }
}

export default Genres;
