
import React, { Component } from 'react';
import { ListView, GridView, GridRow, TouchableOpacity, Card, Image, View, Subtitle } from '@shoutem/ui';

// <Image source={genre.image} styleName="medium-wide" />

class Genres extends Component {
    renderRow(rowData, sectionId, index) {
        const cellViews = rowData.map((genre, id) => (
            <TouchableOpacity key={id} styleName="flexible">
                <Card styleName="flexible">
                    <Image source={require('./media/alternative_rock.jpg')} styleName="medium-wide" />
                </Card>
                <View styleName="content">
                    <Subtitle numberOfLines={1}>{genre.name}</Subtitle>
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
