
import { action, computed, observable } from 'mobx';
import * as firebase from 'firebase';
import take from 'lodash/take';

firebase.initializeApp({
    databaseURL: 'https://hacker-news.firebaseio.com'
});

class Store {
    @observable stories = observable.map();
    @observable currentStoryType = "topstories";
    @observable items = observable.map();

    @action listenForStories(storyType) {
        firebase.database()
                .ref(`v0/${storyType}`)
                .on('value', snapshot => {
                    const ids = take(snapshot.val(), 10);

                    this.updateStories(storyType, ids);
                    ids.forEach(id => this.listenToItem(id));
                })
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
}

export default new Store();
