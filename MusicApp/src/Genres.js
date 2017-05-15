
import React, { Component } from 'react';
import { ListView, GridView, GridRow, TouchableOpacity, Card, Image, View, Subtitle, Spinner } from '@shoutem/ui';


const Flickr = function (search) {
    return fetch(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=true&api_key=8dacb3c2a9b8ff4016fab4a76df1441c&license=1&safe_search=1&content_type=1&text=${search} music`
    ).then(res => res.json())
     .then(json => {
         return new Promise((resolve, reject) => {
             const { farm, server, id, secret } = json.photos.photo[Math.round(Math.random()*10)];
             resolve(`https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_z.jpg`);
         });
     });
}

class GenreArt extends Component {
    state = {
        uri: null
    }

    componentDidMount() {
        Flickr(this.props.name).then(uri => {
            console.log(uri);
            this.setState({ uri })
        });
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
                    <GenreArt name={genre.name} />
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
