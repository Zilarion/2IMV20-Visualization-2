'use strict';

var XHRPromise = require('xhr-promise');

class ElasticSearch {
    static query(q) {
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

                return JSON.parse(xhrPromise.getXHR().responseText).hits.hits.map(hit => hit.source);
            })
    }
}