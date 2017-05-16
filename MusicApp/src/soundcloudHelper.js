
const SC_KEY = '2t9loNQH90kzJcsFCODdigxfp325aq4z';

export const search = (query, limit = 10, page = 0) => {
    return fetch(
        `https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${SC_KEY}&limit=${limit}&offset=${page*limit}&linked_partitioning=1`
    ).then(res => res.json())
     .then(json => new Promise((resolve, reject) => {
         resolve(json);
     }));
};

export const streamUrl = (trackUrl) => `${trackUrl}/stream?client_id=${SC_KEY}`;
