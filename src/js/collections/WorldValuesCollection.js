'use strict';

var Collection = require('../Collection');
var TimeSeries = require('../dao/TimeSeries');

class WorldValuesCollection extends Collection {
    loadData() {
        if (!this.settings.metric) {
            return Promise.reject();
        }

        return TimeSeries
            .getByIndicatorAndCountryCode(this.settings.metric, this.settings.properties, 'WLD')
            .then((data) => {
                data = data || {values: {}};

                this.models = data.values;
            });
    }
}

module.exports = WorldValuesCollection;