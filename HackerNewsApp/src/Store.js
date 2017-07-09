
import { action, computed, observable } from 'mobx';
import * as firebase from 'firebase';
import take from 'lodash/take';

firebase.initializeApp({
    databaseURL: 'https://hacker-news.firebaseio.com'
});

class Store {
    @observable stories = observable.map();
    @observable items = observable.map();
    @observable currentStoryType = "topstories";
    @observable storyTypes = [
        {name: 'Top', value: 'topstories'},
        {name: 'Ask HN', value: 'askstories'},
        {name: 'Show HN', value: 'showstories'},
        {name: 'Jobs', value: 'jobstories'}
    ];
    @observable alreadyListening = observable.map();

    @computed get selectedStoryOption() {
        return this.storyTypes.find(
            ({ name, value }) => value === this.currentStoryType
        );
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
        this.currentStoryType = value;
        this.listenForStories(value);
    }
}

export default new Store();
