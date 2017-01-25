'use strict';

const Collection = require('../core/Collection');
const TimeSeriesDAO = require('../dao/TimeSeriesDAO');

class MetricSeriesCollection extends Collection {
    loadData() {
        return this
            .getMetricSeries()
            .then(metrics => {
                this.models = {};
                metrics.forEach((timeSeries) => {
                    this.models[timeSeries.countryCode] = this.models[timeSeries.countryCode] || {};
                    this.models[timeSeries.countryCode][timeSeries.id] = timeSeries.values[this.settings.year];
                });
            });
    }
    getMetricSeries() {
        // TODO: check if metrics the same, then dont reload

        return TimeSeriesDAO
            .getAllByMetrics(this.settings.metrics)
            .then(metricSeries => {
                this.metricSeries = metricSeries;
                return metricSeries;
            });
    }
}

module.exports = MetricSeriesCollection;