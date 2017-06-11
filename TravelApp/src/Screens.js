
import React, { Component } from 'react';

import ListScreen from './ListScreen';

export class ClimatesScreen extends Component {
    static navigationOptions = {
        title: "Where you goin?"
    }

    static Climates = ["Tropical", "Dry", "Temperate", "Continental", "Polar"]

    navigate = (name) => {
        const { navigate } = this.props.navigation;

        navigate('Areas', { name });
    }

    render() {
        const { Climates } = this.constructor;

        return (
            <ListScreen choices={Climates} navigate={this.navigate}
                        flickrSearch={(name) => `${name} scene`} />
        );
    }
}

export class AreasScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `What type of ${navigation.state.params.name}?`
    })

    static Areas = ["Mountains", "Lowlands", "Inland", "Coastal"]

    navigate = (name) => {
        const { navigate } = this.props.navigation;

        //navigate('Areas', { name });
    }

    flickrSearch = (name) => {
        const { navigation } = this.props;

        return `${navigation.state.params.name} ${name} area`;
    }

    render() {
        const { Areas } = this.constructor;

        return (
            <ListScreen choices={Areas} navigate={this.navigate}
                        flickrSearch={this.flickrSearch} />
        );
    }
}
