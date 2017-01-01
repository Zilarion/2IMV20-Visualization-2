'use strict';

const Collection = require('../core/Collection');
const TimeSeriesDAO = require('../dao/TimeSeriesDAO');

class ValuesCollection extends Collection {
    loadData() {
        return this
            .getTimeSeries()
            .then((timeSeries) => {
                this.models = {};

                timeSeries.forEach((timeSeries) => {
                    this.models[timeSeries.countryCode] =
                        this.settings.year in timeSeries.values ?
                            timeSeries.values[this.settings.year] :
                            null;
                });
            });
    }

    getTimeSeries() {
        if (this.settings.metric === this.metric) {
            Promise.resolve(this.timeSeries);
        }

        return TimeSeriesDAO
            .getAllByMetric(this.settings.metric, this.settings.properties)
            .then(timeSeries => {
                this.timeSeries = timeSeries;

                return timeSeries;
            });
    }
}

module.exports = ValuesCollection;