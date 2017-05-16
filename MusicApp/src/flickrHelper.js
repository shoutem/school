
export default Flickr = function (search) {
    return fetch(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=true&api_key=8dacb3c2a9b8ff4016fab4a76df1441c&license=1&safe_search=1&content_type=1&text=${search} music`
    ).then(res => res.json())
     .then(json => new Promise((resolve, reject) => {
         const { farm, server, id, secret } = json.photos.photo[Math.round(Math.random()*10)];
         resolve(`https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_z.jpg`);
     }));
};
