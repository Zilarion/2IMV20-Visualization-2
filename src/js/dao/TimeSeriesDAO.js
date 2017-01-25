'use strict';

const es = require('../connections/ElasticSearch');

class TimeSeriesDAO {
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

    static getAllByCountry(country) {
        return es.queryAll({
            query: {
                bool: {
                    filter: [
                        {term: {countryCode: country.toLowerCase()}},
                        {type: {value: 'timeSeries'}}
                    ]
                }
            },
            size: 1000
        });
    }

    static getAllByMetrics(metrics) {
        return es.queryAll({
            query: {
                bool: {
                    must: {
                        type: {value: 'timeSeries'}
                    },
                    should: metrics.map(metric => {
                        return {term: {id: metric.toLowerCase()}};
                    }),
                    minimum_should_match: 1,
                }
            },
            size: 1000
        });
    }

    static getByMetricAndCountry(metric, properties, country) {
        return es.query({
            query: {
                bool: {
                    filter: Object.entries(properties)
                        .map(([property, value]) => {
                            return {term: {[property]: value}};
                        })
                        .concat([
                            {term: {metric: metric.toLowerCase()}},
                            {term: {countryCode: country.toLowerCase()}},
                            {type: {value: 'timeSeries'}}
                        ])
                }
            },
            size: 1000
        });
    }
}

module.exports = TimeSeriesDAO;