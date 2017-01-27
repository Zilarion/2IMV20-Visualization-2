'use strict';

const Collection = require('../core/Collection');
const TimeSeriesDAO = require('../dao/TimeSeriesDAO');

class TimeSeriesCollection extends Collection {
    loadData() {
        return TimeSeriesDAO
            .getByMetricAndCountry(
                this.settings.data.metric,
                this.settings.data.properties,
                this.settings.country.code
            )
            .then(timeSeries => {
                this.models = timeSeries ? timeSeries.values : [];
            });
    }
}

module.exports = TimeSeriesCollection;