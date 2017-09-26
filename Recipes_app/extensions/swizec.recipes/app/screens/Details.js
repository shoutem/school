
import React, {
    Component
} from 'react';

import {
    ScrollView,
} from 'react-native';

import {
    Icon,
    Row,
    Subtitle,
    Text,
    Title,
    View,
    Image,
    Divider,
    Tile,
} from '@shoutem/ui';

export default class Details extends Component {
    render() {
        const { recipe } = this.props;

        return (
            <ScrollView style = {{marginTop:-70}}>
                <Image styleName="large-portrait" source={{ uri: recipe.image &&
                                                          recipe.image.url ? recipe.image.url : undefined }}>
                    <Tile>
                        <Title>{recipe.name}</Title>
                    </Tile>
                </Image>

                {recipe.ingredients.map(ingredient => (
                    <Row>
                    <Text>{ingredient}</Text>
                    </Row>
                 ))}

                <Divider styleName="line" />


            </ScrollView>
        );
    }
}
