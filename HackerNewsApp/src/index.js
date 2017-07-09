
import React, { Component } from 'react';
import { Screen, NavigationBar, DropDownMenu, Divider, View } from '@shoutem/ui';
import { CardStack } from '@shoutem/ui/navigation';
import { useStrict } from 'mobx';
import { Provider, observer } from 'mobx-react/native';

import Store from './Store';
import StoriesList from './StoriesList';

useStrict(true);

@observer
class App extends Component {
    componentDidMount() {
        Store.listenForStories(Store.currentRoute.key);
    }

    renderDropDown() {
        return (
            <DropDownMenu options={Store.storyTypes.slice()}
                          titleProperty="name"
                          valueProperty="value"
                          selectedOption={Store.selectedStoryOption}
                          onOptionSelected={storyType => Store.pickStoryType(storyType)} />
        );
    }

    renderNavBar({ navigationState }) {
        return (
            <NavigationBar hasHistory={navigationState.index > 0}
                           navigateBack={() => Store.navigateBack()}
                           centerComponent={this.renderDropDown()} />
        );
    }

    renderScene({ scene }) {
        const { route } = scene;

        const isStoryList = Store.storyTypes
                                 .map(({ name, value }) => value)
                                 .includes(route.key);

        if (isStoryList) {
            return (
                <Screen style={{paddingTop: 75}}>
                    <StoriesList storyType={route.key} />
                </Screen>
            )
        }else{
            return null;
        }
    }

    render() {
        return (
            <Provider store={Store}>
                <CardStack navigationState={Store.navigationState}
                           renderNavBar={this.renderNavBar.bind(this)}
                           renderScene={this.renderScene.bind(this)} />
            </Provider>
        )
    }
}

export default App;
