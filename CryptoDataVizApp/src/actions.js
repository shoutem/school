
import fetch from 'better-fetch';

const URL = "https://api-public.sandbox.gdax.com/";


export const initData = () => {
    console.log("INITING DATA");
    return function (dispatch) {
        console.log('HAI');
        fetch(`${URL}products`)
          .then(fetch.throwErrors)
          .then(res => res.json())
          .then(json => {
              console.log(json);
          });
    };
}
