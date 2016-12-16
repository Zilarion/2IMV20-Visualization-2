'use strict';

var es = require('../ElasticSearch');

class TimeSeries {
    static getAllByIndicator(metric, properties) {
        return es.query({
            query: {
                filter: {
                    Object.assign({metric}, properties).enumerate().map(x => {term: {[x[0]]: x[1]}})
                    .concat([{type: {value: 'timeseries'}}])
                }]
            },
            size: 1000
        });
    }
}

module.exports = TimeSeries;