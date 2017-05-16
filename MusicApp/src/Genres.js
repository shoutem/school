
import React, { Component } from 'react';
import { ListView, GridView, GridRow, TouchableOpacity, Card, Image, View, Subtitle, Spinner } from '@shoutem/ui';
import { connect } from 'react-redux';

import { playGenre } from './actions';
import GenreArt from './GenreArt';


const GenreButton = connect(
    (state) => ({})
)(({ genre, dispatch }) => (
    <TouchableOpacity styleName="flexible" onPress={() => dispatch(playGenre(genre))}>
        <View>
            <GenreArt name={genre.name} />
        </View>
    </TouchableOpacity>
));

class Genres extends Component {
    renderRow(rowData, sectionId, index) {
        const cellViews = rowData.map((genre, id) => (
            <GenreButton  key={id} genre={genre} />
        ));

        return (
            <GridRow columns={2}>
                {cellViews}
            </GridRow>
        )
    }

    render() {
        const groupedGenres = GridRow.groupByRows(this.props.genres, 2);

        return (
            <ListView data={groupedGenres}
                      renderRow={this.renderRow} />
        )
    }
}

export default Genres;
