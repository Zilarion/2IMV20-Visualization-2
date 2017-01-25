'use strict';

const es = require('../connections/ElasticSearch');

class MetricsDAO {
    static getAll() {
        return es.queryAll({
            query: {
                bool: {
                    filter: {
                        type: {
                            value: 'metric'
                        }
                    }
                }
            },
            size: 1000
        });
    }
}

module.exports = MetricsDAO;