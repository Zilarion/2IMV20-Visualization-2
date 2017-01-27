'use strict';

const es = require('../connections/ElasticSearch');

class MetricsDAO {
    static getAll() {
        return es.queryAll('metric', {
            query: {},
            size: 1000
        });
    }
}

module.exports = MetricsDAO;