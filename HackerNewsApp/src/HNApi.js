
import cheerio from 'cheerio-without-node-native';

const convertRequestBodyToFormUrlEncoded = (data) => {
    const bodyKeys = Object.keys(data);
    const str = [];
    for (let i = 0; i < bodyKeys.length; i += 1) {
        const thisKey = bodyKeys[i];
        const thisValue = data[thisKey];
        str.push(`${encodeURIComponent(thisKey)}=${encodeURIComponent(thisValue)}`);
    }
    return str.join('&');
};


class HN {
    BaseURL = 'https://news.ycombinator.com';

    login(username, password) {
        let headers = new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*"
        });

        return fetch(`${this.BaseURL}/login`,
                     {
                         method: "POST",
                         headers: headers,
                         body: convertRequestBodyToFormUrlEncoded({
                             acct: username,
                             pw: password,
                             goto: 'news'
                         }),
                         mode: 'no-cors',
                         credentials: 'include'
                     }).then(res => res.text())
                       .then(body => {
                           if (body.match(/Bad Login/i)) {
                               return false;
                           }else{
                               return true;
                           }
                       });
    }

    getUpvoteURL(id) {
        return fetch(`${this.BaseURL}/item?id=${id}`,
                     {
                         mode: 'no-cors',
                         credentials: 'include'
                     }).then(res => res.text())
                       .then(body => {
                           const doc = cheerio.load(body);

                           return doc(`#up_${id}`).attr('href');
                       });
    }

    getHmac(id) {
        return fetch(`${this.BaseURL}/item?id=${id}`,
                     {
                         mode: 'no-cors',
                         credentials: 'include'
                     }).then(res => res.text())
                       .then(body => {
                           const doc = cheerio.load(body);

                           return doc('input[name=hmac]').attr('value');
                       });
    }

    upvote(id) {
        return this.getUpvoteURL(id)
                   .then(url => fetch(`${this.BaseURL}/${url}`, {
                       mode: 'no-cors',
                       credentials: 'include'
                   }))
                   .then(res => res.text())
                   .then(body => {
                       return true;
                   })
                   .catch(error => {
                       console.log(error);
                       return false;
                   });
    }

    reply(id, text) {
        return this.getHmac(id)
                   .then(hmac => {
                       let headers = new Headers({
                           "Content-Type": "application/x-www-form-urlencoded",
                           "Access-Control-Allow-Origin": "*"
                       });

                       return fetch(`${this.BaseURL}/comment`,
                                    {
                                        method: "POST",
                                        headers: headers,
                                        body: convertRequestBodyToFormUrlEncoded({
                                            parent: id,
                                            goto: `item?id=${id}`,
                                            hmac: hmac,
                                            text: text
                                        }),
                                        mode: 'no-cors',
                                        credentials: 'include'
                                    })
                   }).then(res => res.text())
                   .then(body => {
                       return {
                           success: true,
                           error: null
                       }
                   });
    }
}

export default new HN();
