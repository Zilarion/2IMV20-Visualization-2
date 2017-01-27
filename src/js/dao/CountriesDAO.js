'use strict';

const es = require('../connections/ElasticSearch');

class CountriesDAO {
    static getAll() {
        return es.queryAll('country', {
            query: {},
            size: 1000
        });
    }
}

module.exports = CountriesDAO;