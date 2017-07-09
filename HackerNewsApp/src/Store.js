
import { action, computed, observable } from 'mobx';
import * as firebase from 'firebase';
import take from 'lodash/take';

firebase.initializeApp({
    databaseURL: 'https://hacker-news.firebaseio.com'
});

class Store {
    @observable stories = observable.map();
    @observable items = observable.map();
    @observable storyTypes = [
        {name: 'Top', value: 'topstories'},
        {name: 'Ask HN', value: 'askstories'},
        {name: 'Show HN', value: 'showstories'},
        {name: 'Jobs', value: 'jobstories'}
    ];
    @observable alreadyListening = observable.map();
    @observable _navigationState = {
        index: 0,
        routes: [
            {key: 'topstories'}
        ]
    };

    @computed get currentRoute() {
        return this._navigationState.routes[this._navigationState.index];
    }

    @computed get selectedStoryOption() {
        const { key } = this.currentRoute;

        return this.storyTypes.find(
            ({ name, value }) => value === key
        );
    }

    @computed get navigationState() {
        return {
            index: this._navigationState.index,
            routes: this._navigationState.routes.slice()
        };
    }

    @action navigateBack() {
        this._navigationState.index -= 1;
        this._navigationState.routes.pop();
    }

    @action listenForStories(storyType) {
        if (!this.alreadyListening.get(storyType)) {
            this.alreadyListening.set(storyType, true);
            firebase.database()
                    .ref(`v0/${storyType}`)
                    .on('value', snapshot => {
                        const ids = take(snapshot.val(), 10);

                        this.updateStories(storyType, ids);
                        ids.forEach(id => this.listenToItem(id));
                    })
        }
    }

    @action updateStories(storyType, ids) {
        this.stories.set(storyType, ids);
    }

    @action listenToItem(id) {
        firebase.database()
                .ref(`v0/item/${id}`)
                .on('value', snapshot => {
                    this.updateItem(id, snapshot.val());
                });
    }

    @action updateItem(id, val) {
        this.items.set(id, val);
    }

    @action pickStoryType({ value }) {
        this.listenForStories(value);

        this._navigationState.routes.push({
            key: value
        });
        this._navigationState.index += 1;
    }

    @action openStory(id) {
        this._navigationState.routes.push({
            key: String(id),
            id: id
        });
        this._navigationState.index += 1;
    }
}

export default new Store();
