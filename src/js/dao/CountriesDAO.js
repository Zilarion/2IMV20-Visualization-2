'use strict';

const es = require('../connections/ElasticSearch');

class CountriesDAO {
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

module.exports = CountriesDAO;