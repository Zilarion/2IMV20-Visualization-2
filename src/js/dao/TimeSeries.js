'use strict';

var es = require('../ElasticSearch');

class TimeSeries {
    static getAllByIndicator(metric, properties) {
        return es.query({
            query: {
                bool: {
                    filter: Object.entries(Object.assign({metric}, properties))
                        .map(([property, value]) => {
                            return {term: {[property]: value}};
                        })
                        .concat([{type: {value: 'timeSeries'}}])
                }
            },
            size: 1000
        });
    }
}

module.exports = TimeSeries;