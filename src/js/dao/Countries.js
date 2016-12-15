'use strict';

var es = require('../ElasticSearch');

class Countries {
    static getAll() {
        return es.query({
            query: {
                type : {
                    value: 'country'
                },
            },
            size: 1000
        });
    }
}

module.exports = Countries;