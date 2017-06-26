
import fetch from 'better-fetch';

const URL = "https://api-public.sandbox.gdax.com/",
      SOCKET_URL = "wss://ws-feed.gdax.com"


export const initData = () => {
    return function (dispatch) {
        fetch(`${URL}products`)
          .then(fetch.throwErrors)
          .then(res => res.json())
          .then(json => {
              dispatch(setProducts(json));
              //dispatch(fetchAllBooks());
              dispatch(connectSocket());
          });
    };
}

export const connectSocket = () => {
    const ws = new WebSocket(SOCKET_URL);

    return function (dispatch, getState) {
        ws.onopen = () => {
            const state = getState(),
                  product_ids = Object.keys(state.prices)
                                      .map(k => state.prices[k].id);

            console.log('subscribing', JSON.stringify({
                type: 'subscribe',
                product_ids
            }));

            ws.send(JSON.stringify({
                type: 'subscribe',
                product_ids
            }));
        }

        ws.onmessage = (msg) => {
            const { type, price, product_id, reason } = JSON.parse(msg.data);

            if (type === 'done' && reason === 'filled') {
                dispatch(addPrice(product_id, price));
            }
        }

        ws.onerror = (e) => {
            console.log(e.message);
        }

        ws.onclose = (e) => {
            console.log(e.code, e.reason);
        }
    }
}

export const fetchProductOrderBook = (key) => {
    return function (dispatch, getState) {
        const { id } = getState().prices[key];

        fetch(`${URL}products/${id}/book`)
          .then(fetch.throwErrors)
          .then(res => res.json())
          .then(json => {
              console.log(json);
          });
    }
}

export const fetch24hrPrices = () => {
    return function (dispatch, getState) {
        const state = getState();

        Object.keys(state.prices).map(currency => {
            dispatch(fetch24hrPrice(currency));
        });
    };
}

export const fetch24hrPrice = (currency) => {
    return function (dispatch, getState) {
        const state = getState(),
              { id } = state.prices[currency];

        fetch(`${URL}products/${id}/stats`)
   .then(fetch.throwErrors)
   .then(res => res.json())
   .then(json => {
       console.log(json);
   });
    };
};

export const setProducts = (products) => ({
    type: 'SET_PRODUCTS',
    products: products.filter(({ quote_currency }) => quote_currency === 'USD')
});

export const addPrice = (product, price) => ({
    type: 'ADD_PRICE',
    product,
    price
});
