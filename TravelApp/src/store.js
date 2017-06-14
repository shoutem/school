
import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBr0vNOfIeX7rmvFnUhHol44RIY5opsvG4",
    authDomain: "travelapp-aff43.firebaseapp.com",
    databaseURL: "https://travelapp-aff43.firebaseio.com",
    projectId: "travelapp-aff43",
    storageBucket: "travelapp-aff43.appspot.com",
    messagingSenderId: "971673915374"
}
firebase.initializeApp(firebaseConfig);

const ITEMS = {
    Toiletries: [
        {id: 0, name: 'Toothbrush'},
        {id: 1, name: 'Toothpaste'},
        {id: 2, name: 'Facewash'}
    ],
    Clothes: [
        {id: 0, name: 'Jacket'},
        {id: 1, name: 'T-Shirts'},
        {id: 2, name: 'Underpants'}
    ],
    Gear: [
        {id: 0, name: 'Laptop'},
        {id: 1, name: 'Book'},
        {id: 2, name: 'Phone Charger'}
    ]
}

//AsyncStorage.clear();


class Store {
    makeKey({ navigation }) {
        const { climate, area, accomodation } = navigation.state.params,
              { routeName } = navigation.state;

        return `@MySuperItemsStore:${climate}/${area}/${accomodation}/${routeName}`;
    }

    firebaseKey({ navigation }) {
        const { climate, area, accomodation } = navigation.state.params,
              { routeName } = navigation.state;

        return `${climate}:${area}:${accomodation}:${routeName}`;
    }

    getItems({ navigation }) {
        const key = this.makeKey({ navigation });

        return firebase.auth()
                       .signInAnonymously()
                       .then(() => new Promise((resolve, reject) => {
                           firebase.database()
                                   .ref(this.firebaseKey({ navigation }))
                                   .once('value', (snapshot) => {
                                       const val = snapshot.val();

                                       if (val === null) {
                                           resolve([]);
                                       }else{
                                           resolve(val);
                                       }
                                   })
                       }))
                       .then(firebaseItems =>
                           AsyncStorage.getItem(key).then(
                               value => new Promise((resolve, reject) => {
                                   let items = ITEMS[navigation.state.routeName];

                                   if (value !== null) {
                                       items = JSON.parse(value);
                                   }

                                   Object.keys(firebaseItems).forEach(id => {
                                       if (!items.find(i => i.id === id)) {
                                           items.push(firebaseItems[id]);
                                       }
                                   });

                                   AsyncStorage.setItem(key, JSON.stringify(items))
                                               .then(() => resolve(items));
                               })));
    }

    saveItems({ navigation, items }) {
        const key = this.makeKey({ navigation });

        return AsyncStorage.setItem(key, JSON.stringify(items));
    }

    clearItems({ navigation }) {
        const key = this.makeKey({ navigation });

        return this.getItems({ navigation })
                   .then(items => {
                       items = items.map(item => {
                           item.value = false;
                           return item;
                       });

                       return this.saveItems({ navigation, items });
                   });
    }

    addItem({ navigation, text }) {
        const key = this.makeKey({ navigation });

        return firebase.auth()
                       .signInAnonymously()
                       .then(() => {
                           const itemRef = firebase.database()
                                                   .ref(this.firebaseKey({ navigation }))
                                                   .push();

                           const item = {
                               id: itemRef.key,
                               name: text
                           };

                           itemRef.set(item);

                           return this.getItems({ navigation });
                       })

    }

    removeItem({ navigation, id }) {
        const key = this.makeKey({ navigation });

        return this.getItems({ navigation })
                   .then(items => {
                       items = items.filter(item => item.id !== id);
                       return this.saveItems({ navigation, items });
                   });
    }
}

export default new Store();
