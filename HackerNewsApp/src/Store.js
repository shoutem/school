
import { action, computed, observable, extendObservable } from 'mobx';
import * as firebase from 'firebase';
import take from 'lodash/take';

firebase.initializeApp({
    databaseURL: 'https://hacker-news.firebaseio.com'
});

const N_STORIES = 30,
      LANG_API_KEY = 'AIzaSyCSE5mekK1XxfDMQde8bywlaOMIdN5L7ug';

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
            {key: 'topstories', type: 'storylist'}
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
                        const ids = take(snapshot.val(), N_STORIES);

                        this.updateStories(storyType, ids);
                        ids.forEach(id => this.listenToStory(id));
                    })
        }
    }

    @action updateStories(storyType, ids) {
        this.stories.set(storyType, ids);
    }

    @action listenToStory(id) {
        firebase.database()
                .ref(`v0/item/${id}`)
                .on('value', snapshot => {
                    this.updateItem(id, snapshot.val());
                });
    }

    @action updateItem(id, val) {
        val.sentiment = {fetched: false};
        this.items.set(id, val);
    }

    @action analyzeSentiment(id) {
        const { text, sentiment } = this.items.get(id);

        console.log('analyzing sentiment', id);

        if (!sentiment.fetched) {
            fetch(`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${LANG_API_KEY}`,
                  {
                      method: "POST",
                      headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                          "encodingType": "UTF8",
                          "document": {
                              "type": "PLAIN_TEXT",
                              "content": text
                          }
                      })
                  }).then(res => res.json())
                    .then(json => {
                        this.updateSentiment(id, json);
                    });
        }
    }

    @action updateSentiment(id, { documentSentiment }) {
        console.log('updating sentiment', id, documentSentiment);
        if (documentSentiment) {
            extendObservable(this.items.get(id).sentiment, documentSentiment);
            this.items.get(id).sentiment.fetched = true;
            console.log(this.items.get(id));
        }
    }

    @action loadItem(id) {
        firebase.database()
                .ref(`v0/item/${id}`)
                .once('value', snapshot => {
                    const val = snapshot.val();

                    this.updateItem(id, val);
                    this.analyzeSentiment(id);

                    if (val.kids) {
                        val.kids.forEach(id => this.loadItem(id));
                    }
                });
    }

    @action pickStoryType({ value }) {
        this.listenForStories(value);

        this._navigationState.routes.push({
            key: value,
            type: 'storylist'
        });
        this._navigationState.index += 1;
    }

    @action openStory(id) {
        this._navigationState.routes.push({
            key: String(id),
            id: id,
            type: 'story'
        });
        this._navigationState.index += 1;

        // recursively walk through kids
        this.loadItem(id);
    }
}

export default new Store();
