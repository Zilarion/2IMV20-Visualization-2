'use strict';

var IndicatorsCollection = require('../collections/IndicatorsCollection');
var Model = require('../Model');

class FilterService {
    constructor() {
        this.indicator = Model.create({
            metric: null,
            properties: {}
        });

        this.indicators = new IndicatorsCollection();
        this.indicators.on('change', () => {
            this.setMetric('inflation');
        })
    }

    setMetric(metric) {
        this.indicator.metric = metric;

        var properties = this.indicators.get(metric).properties;
        var propertyValues = {};
        Object.keys(properties).forEach((property) => {
            propertyValues[property] = properties[property].defaultValue;
        });

        this.indicator.properties = Model.create(propertyValues);
        this.indicator.properties.on('change', () => {
            this.indicator.emit('change');
        });
    }
}

module.exports = FilterService;