'use strict';

var es = require('../ElasticSearch');

class Indicators {
    static getAll() {
        return es.queryAll({
            query: {
                bool: {
                    filter: {
                        type: {
                            value: 'indicator'
                        }
                    }
                }
            },
            size: 1000
        });
    }
}

module.exports = Indicators;