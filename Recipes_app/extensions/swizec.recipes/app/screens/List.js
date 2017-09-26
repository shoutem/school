import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { connect } from 'react-redux';

import {
  Image,
  ListView,
  Tile,
  Title,
  Subtitle,
  Overlay,
  Screen,
  TouchableOpacity,
  Spinner
} from '@shoutem/ui';
import { navigateTo } from '@shoutem/core/navigation';
import { ext } from '../extension';

const APP_ID = '56afbc9d',
      APP_KEY = '52239a0ccf9da32e63cfa99086435cb3';

export class List extends Component {
    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.state = {
            recipes: []
        }
    }

    componentWillMount() {
        this.getRecipes();
    }

    getRecipes() {
        fetch(`https://api.edamam.com/search?q=chicken&app_id=${APP_ID}&app_key=${APP_KEY}&diet=balanced`)
          .then(res => res.json())
          .then(json => {
              this.setState({
                  recipes: json.hits.map(({ recipe }) => ({
                      image: { url: recipe.image },
                      name: recipe.label,
                      ingredients: recipe.ingredientLines
                  }))
              });
          })
          .catch(err => console.error(err));

    }

    renderRow(recipe) {
        const { name, image } = recipe;
        const { navigateTo } = this.props;

        return (
            <TouchableOpacity onPress={() => navigateTo({
                screen: ext('Details'),
                props: { recipe }
            })}>
            <Image styleName="large-banner" source={{ uri: image && image.url ? image.url : undefined  }}>
                <Tile>
                    <Title>{name}</Title>
                </Tile>
            </Image>
            </TouchableOpacity>
        );
    }

    render() {
        if (this.state.recipes.length > 0) {
            return (
                <ListView data={this.state.recipes}
                          renderRow={recipe => this.renderRow(recipe)} />
            );
        }else{
            return (<Spinner />)
        }
    }
}

export default connect(
  undefined,
  { navigateTo }
)(List);
