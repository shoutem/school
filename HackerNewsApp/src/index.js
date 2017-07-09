
import React, { Component } from 'react';
import { Screen, NavigationBar, DropDownMenu, Divider, View } from '@shoutem/ui';
import { useStrict } from 'mobx';
import { Provider, observer } from 'mobx-react/native';

import Store from './Store';
import StoriesList from './StoriesList';

useStrict(true);

@observer
class App extends Component {
    componentDidMount() {
        Store.listenForStories(Store.currentStoryType);
    }

    get centerMenu() {
        return (
            <DropDownMenu options={Store.storyTypes.slice()}
                          titleProperty="name"
                          valueProperty="value"
                          selectedOption={Store.selectedStoryOption}
                          onOptionSelected={storyType => Store.pickStoryType(storyType)} />
        );
    }

    render() {
        return (
            <Provider store={Store}>
                <Screen>
                    <View style={{paddingTop: 75}}>
                        <StoriesList storyType={Store.currentStoryType} />
                    </View>

                    <NavigationBar centerComponent={this.centerMenu} />
                </Screen>
            </Provider>
        )
    }
}

export default App;
