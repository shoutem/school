
import { combineReducers } from 'redux';

const initialPrices = {
    eth: [],
    btc: [],
    lite: []
}

const prices = (state = initialPrices, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    prices
});

export default rootReducer;
