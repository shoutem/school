
import querystring from 'querystring';

export default Flickr = function (search) {
    const query = querystring.stringify({
        method: 'flickr.photos.search',
        format: 'json',
        nojsoncallback: 'true',
        api_key: '8dacb3c2a9b8ff4016fab4a76df1441c',
        safe_search: 1,
        sort: 'relevance',
        content_type: 1,
        text: search
    });

    return fetch(
        `https://api.flickr.com/services/rest/?${query}`
    ).then(res => res.json())
     .then(json => new Promise((resolve, reject) => {
         const N = json.photos.photo.length,
               index = Math.round(Math.random()*(N > 10 ? 10 : N));
         const { farm, server, id, secret } = json.photos.photo[index];

         resolve(`https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_z.jpg`);
     }))
     .catch(err => {
         if (search.indexOf('+') > -1) {
             return Flickr(search.replace('+', ' '))
         }else{
             return null;
         }
     });
};
