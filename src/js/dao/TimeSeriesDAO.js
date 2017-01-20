'use strict';

const es = require('../connections/ElasticSearch');

class TimeSeries {
    static getAllByMetric(metric, properties) {
        return es.queryAll({
            query: {
                bool: {
                    filter: Object.entries(properties)
                        .map(([property, value]) => {
                            return {term: {[property]: value}};
                        })
                        .concat([
                            {term: {metric: metric.toLowerCase()}},
                            {type: {value: 'timeSeries'}}
                        ])
                }
            },
            size: 1000
        });
    }
}

module.exports = TimeSeries;