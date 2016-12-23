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

    getMetricAndProperties() {
        var metric = {
            field: 'metric',
            name: 'Metric',
            value: this.indicator.metric,
            options: this.indicators.asArray().map((indicator) => {
                return {
                    value: indicator.metric,
                    text: indicator.name
                };
            })
        };

        var indicator = this.indicators.get(this.indicator.metric);

        var properties = Object.entries(indicator.properties)
            .map(([property, value]) => {
                return {
                    field: property,
                    name: indicator.properties[property].name,
                    value: value,
                    options: Object.entries(indicator.properties[property].values)
                        .map(([value, content]) => {
                            return {
                                value: value,
                                text: content.name
                            };
                        })
                };
            });

        return [metric].concat(properties);
    }
}

module.exports = FilterService;