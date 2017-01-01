'use strict';

const XHRPromise = require('xhr-promise');

class ElasticSearch {
    static query(q) {
        return this
            .queryAll(q)
            .then((results) => {
                return results[0];
            });
    }

    static queryAll(q) {
        var xhrPromise = new XHRPromise();

        return xhrPromise
            .send({
                method: 'POST',
                url: '/data/_search',
                data: JSON.stringify(q)
            })
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('Request failed');
                }

                return response.responseText.hits.hits.map(hit => hit._source);
            })
    }
}

module.exports = ElasticSearch;