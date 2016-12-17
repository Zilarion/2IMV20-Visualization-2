'use strict';

var es = require('../ElasticSearch');

class TimeSeries {
    static getAllByIndicator(metric, properties) {
        return es.queryAll({
            query: {
                bool: {
                    filter: Object.entries(properties)
                        .map(([property, value]) => {
                            return {term: {[property]: value}};
                        })
                        .concat([
                            {term: {metric: metric}},
                            {type: {value: 'timeSeries'}}
                        ])
                }
            },
            size: 1000
        });
    }

    static getByIndicatorAndCountryCode(metric, properties, countryCode) {
        return es.query({
            query: {
                bool: {
                    filter: Object.entries(properties)
                        .map(([property, value]) => {
                            return {term: {[property]: value}};
                        })
                        .concat([
                            {term: {metric: metric}},
                            {term: {countryCode: countryCode}},
                            {type: {value: 'timeSeries'}}
                        ])
                }
            },
            size: 1000
        });
    }
}

module.exports = TimeSeries;