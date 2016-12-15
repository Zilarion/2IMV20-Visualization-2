'use strict';

var es = require('../ElasticSearch');

class Indicators {
    static getAll() {
        return es.query({
            query: {
                type : {
                    value: 'indicator'
                }
            },
            size: 1000
        });
    }
}

module.exports = Indicators;