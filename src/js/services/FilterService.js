'use strict';

var IndicatorsCollection = require('../collections/IndicatorsCollection');
var Model = require('../Model');

class FilterService {
    constructor() {
        this.filter = Model.create({
            year: 2016,
            metric: null,
            properties: {}
        });

        this.indicators = new IndicatorsCollection();
        this.indicators.on('change', () => {
            this.setMetric('inflation');
        })
    }

    setMetric(metric) {
        this.filter.metric = metric;

        var properties = this.indicators.get(metric).properties;
        var propertyValues = {};
        Object.keys(properties).forEach((property) => {
            propertyValues[property] = properties[property].defaultValue;
        });

        this.filter.properties = Model.create(propertyValues);
        this.filter.properties.on('change', () => {
            this.filter.emit('change');
        });
    }
}

module.exports = FilterService;