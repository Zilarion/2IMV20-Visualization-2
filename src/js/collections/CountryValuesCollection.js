'use strict';

const Collection = require('../core/Collection');
const TimeSeriesDAO = require('../dao/TimeSeriesDAO');

class CountryValuesCollection extends Collection {
    loadData() {
        return this
            .getTimeSeries()
            .then((timeSeries) => {
                this.models = {};

                timeSeries.forEach((timeSeries) => {
                    this.models[timeSeries.id] =
                        this.settings.data.year in timeSeries.values ?
                            timeSeries.values[this.settings.data.year] :
                            null;
                });
            });
    }

    getTimeSeries() {
        // TODO: check if country the same, then dont reload

        return TimeSeriesDAO
            .getAllByCountry(this.settings.country.code)
            .then(timeSeries => {
                this.timeSeries = timeSeries;

                return timeSeries;
            });
    }
}

module.exports = CountryValuesCollection;