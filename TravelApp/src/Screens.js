
import React, { Component } from 'react';

import ListScreen from './ListScreen';

export class ClimatesScreen extends Component {
    static navigationOptions = {
        title: "Going somewhere?"
    }

    static Climates = ["Tropical", "Arid", "Temperate", "Continental", "Arctic"]

    navigate = (climate) => {
        const { navigate } = this.props.navigation;

        navigate('Areas', { climate });
    }

    render() {
        const { Climates } = this.constructor;

        return (
            <ListScreen choices={Climates} navigate={this.navigate}
                        flickrSearch={(name) => `${name} landscape`} />
        );
    }
}

export class AreasScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `A ${navigation.state.params.climate.toLowerCase()} what?`
    })

    static Areas = ["Mountain", "Forest", "City", "Town", "Coast"]

    navigate = (area) => {
        const { navigate } = this.props.navigation,
              { climate } = this.props.navigation.state.params;

        navigate('Accomodations', { climate, area });
    }

    flickrSearch = (area) => {
        const { navigation } = this.props,
              { climate } = this.props.navigation.state.params;

        return `${climate}+${area}`;
    }

    render() {
        const { Areas } = this.constructor;

        return (
            <ListScreen choices={Areas} navigate={this.navigate}
                        flickrSearch={this.flickrSearch} />
        );
    }
}

export class AccomodationsScreen extends Component {
    static navigationOptions = {
        title: "Where are you staying?"
    }

    static Accomodations = ["Hotel", "Camp", "Glamp", "Apartment", "Couch"]

    navigate = (accomodation) => {
        const { navigate } = this.props.navigation,
              { climate, area } = this.props.navigation.state.params;

        navigate('PackingList', { climate, area, accomodation });
    }

    flickrSearch = (accomodation) => {
        const { navigation } = this.props,
              { climate, area } = navigation.state.params;

        return `${area}+${accomodation}`;
    }

    render() {
        const { Accomodations } = this.constructor;

        return (
            <ListScreen choices={Accomodations} navigate={this.navigate}
                        flickrSearch={this.flickrSearch} />
        );
    }
}
