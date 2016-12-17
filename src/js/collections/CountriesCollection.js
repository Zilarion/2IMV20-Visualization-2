'use strict';

var Collection = require('../Collection');
var Countries = require('../dao/Countries');
var TimeSeries = require('../dao/TimeSeries');

class CountriesCollection extends Collection {
    constructor(indicator, time) {
        super(indicator);

        this.time = time;
        this.time.on('change', () => {
            this.updateValues()
                .then(() => this.emit('change'));
        });

        this.data = null;
    }

    loadData() {
        return this
            .loadCountries()
            .then(() => this.loadMetric())
            .then(() => this.updateValues());
    }

    loadCountries() {
        if (this.models.length > 0) {
            return Promise.resolve();
        }

        return Countries
            .getAll()
            .then(countries => {
                this.models = {};
                countries.forEach(country => {
                    country.value = null;
                    this.models[country.code] = country;
                });
            });
    }

    loadMetric() {
        return TimeSeries.getAllByIndicator(this.settings.metric, this.settings.properties)
            .then((data) => {
                this.data = data;
            });
    }

    updateValues() {
        this.data.forEach(timeSeries => {
            if ((timeSeries.countryCode in this.models) && (this.time.year in timeSeries)) {
                this.models[timeSeries.countryCode].value = timeSeries[this.time.year];
            }
        });
    }
}

module.exports = CountriesCollection;