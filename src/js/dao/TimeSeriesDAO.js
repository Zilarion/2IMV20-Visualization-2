'use strict';

const es = require('../connections/ElasticSearch');

class TimeSeriesDAO {
    static getAllByMetric(metric, properties) {
        return es.queryAll('timeSeries', {
            query: {
                bool: {
                    filter: Reflect.ownKeys(properties)
                        .map((property) => {
                            return {term: {[property]: properties[property]}};
                        })
                        .concat([
                            {term: {metric: metric.toLowerCase()}}
                        ])
                }
            },
            size: 1000
        });
    }

    static getAllByCountry(country) {
        return es.queryAll('timeSeries', {
            query: {
                bool: {
                    filter: [
                        {term: {countryCode: country.toLowerCase()}}
                    ]
                }
            },
            size: 1000
        });
    }

    static getAllByMetrics(metrics) {
        return es.queryAll('timeSeries', {
            query: {
                bool: {
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
        return es.query('timeSeries', {
            query: {
                bool: {
                    filter: Reflect.ownKeys(properties)
                        .map((property) => {
                            return {term: {[property]: properties[property]}};
                        })
                        .concat([
                            {term: {metric: metric.toLowerCase()}},
                            {term: {countryCode: country.toLowerCase()}},
                        ])
                }
            },
            size: 1000
        });
    }
}

module.exports = TimeSeriesDAO;