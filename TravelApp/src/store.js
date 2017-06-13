
import { AsyncStorage } from 'react-native';

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


class Store {
    makeKey({ navigation }) {
        const { climate, area, accomodation } = navigation.state.params,
              { routeName } = navigation.state;

        return `@MySuperItemsStore:${climate}/${area}/${accomodation}/${routeName}`;
    }

    getItems({ navigation }) {
        const key = this.makeKey({ navigation });

        return AsyncStorage.getItem(key)
                           .then(value => {
                               return new Promise((resolve, reject) => {
                                   let items = ITEMS[navigation.state.routeName];

                                   if (value !== null) {
                                       items = JSON.parse(value);
                                       resolve(items);
                                   }else{
                                       AsyncStorage.setItem(key, JSON.stringify(items))
                                                   .then(() => resolve(items));
                                   }
                               })
                           });
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

        const item = {
            id: new Date().getTime(),
            name: text
        };

        return this.getItems({ navigation })
                   .then(items => {
                       items = items.concat(item);
                       return this.saveItems({ navigation, items });
                   });
    }
}

export default new Store();
