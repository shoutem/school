
import React, { Component } from 'react';
import { Screen, NavigationBar, DropDownMenu, Divider, View, Text } from '@shoutem/ui';
import { CardStack } from '@shoutem/ui/navigation';
import { useStrict } from 'mobx';
import { Provider, observer } from 'mobx-react/native';

import Store from './Store';
import StoriesList from './StoriesList';
import HNItem from './HNItem';

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
        const route = navigationState.routes[navigationState.index];
        let centerComponent = null;

        if (route.type === 'storylist') {
            centerComponent = this.renderDropDown();
        }else{
            centerComponent = (
                <Text ellipsizeMode="tail" numberOfLines={1}>
                    {Store.items.get(route.id).title}
                </Text>
            );
        }

        return (
            <NavigationBar hasHistory={navigationState.index > 0}
                           navigateBack={() => Store.navigateBack()}
                           centerComponent={centerComponent} />
        );
    }

    renderScene({ scene }) {
        const { route } = scene;

        if (route.type === 'storylist') {
            return (
                <Screen style={{paddingTop: 75}}>
                    <StoriesList storyType={route.key} />
                </Screen>
            )
        }else{
            return (
                <Screen style={{paddingTop: 75}}>
                    <HNItem id={route.id} />
                </Screen>
            );
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
