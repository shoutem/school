
import { combineReducers } from 'redux';
import fromPairs from 'lodash.frompairs';


const prices = (state = {}, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return Object.assign({}, state, fromPairs(
                action.products.map(({ id, base_currency, display_name }) => [
                    id,
                    {
                        id,
                        display_name,
                        base_currency,
                        values: []
                    }
                ])));
        case 'ADD_PRICE':
            const { product, price } = action;
            console.log(state, product);
            return Object.assign({}, state, {
                [product]: Object.assign({}, state[product], {
                    values: state[product].values.concat(Number(price))
                })
            });
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    prices
});

export default rootReducer;
