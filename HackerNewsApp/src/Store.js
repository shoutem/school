
import { action, computed, observable } from 'mobx';
import * as firebase from 'firebase';
import take from 'lodash/take';

firebase.initializeApp({
    databaseURL: 'https://hacker-news.firebaseio.com'
});

class Store {
    @observable topStories = [];
    @observable items = {};

    @action listenForTopStories() {
        firebase.database()
                .ref('v0/topstories')
                .on('value', snapshot => {
                    const ids = take(snapshot.val(), 50);

                    this.updateTopStories(ids);
                    ids.forEach(id => this.listenToItem(id));
                })
    }

    @action updateTopStories(ids) {
        this.topStories.replace(ids);
    }

    @action listenToItem(id) {
        firebase.database()
                .ref(`v0/item/${id}`)
                .on('value', snapshot => {
                    this.updateItem(id, snapshot.val());
                });
    }

    @action updateItem(id, val) {
        this.items[id] = val;
    }
}

export default new Store();
