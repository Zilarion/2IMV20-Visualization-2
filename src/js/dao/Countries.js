'use strict';

var es = require('../ElasticSearch');

class Countries {
    static getAll() {
        return es.queryAll({
            query: {
                bool: {
                    filter: {
                        type: {
                            value: 'country'
                        }
                    }
                }
            },
            size: 1000
        });
    }
}

module.exports = Countries;