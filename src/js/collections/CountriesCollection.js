'use strict';

var Collection = require('../Collection');
var Countries = require('../dao/Countries');
var TimeSeries = require('../dao/TimeSeries');

class CountriesCollection extends Collection {
    constructor(settings) {
        super(settings);

        this.metric = null;
        this.data = null;
    }

    loadData() {
        return this
            .loadCountries()
            .then(() => {
                this.loadMetrics();
            });
    }

    loadCountries() {
        if (this.models.length > 0) {
            return Promise.resolve();
        }

        return Countries
            .getAll()
            .then(countries => {
                this.models = {};
                countries.forEach((country) => {
                    country.value = null;
                    this.models[country.id] = country;
                });
            });
    }

    loadMetrics() {
        var metric = this.settings.metric;

        var promise = (metric === this.metric) ?
            Promise.resolve(this.data) :
            TimeSeries.getAllByMetric(settings.metric);

        return promise.then((data) => {
            this.metric = metric;
            this.data = data;

            this.data.forEach(timeSeries => {
                this.models[timeSeries.countryCode].value = timeSeries[this.settings.year];
            });
        });
    }
}

module.exports = CountriesCollection;