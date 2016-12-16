'use strict';

var Collection = require('../Collection');
var Countries = require('../dao/Countries');
var TimeSeries = require('../dao/TimeSeries');

class CountriesCollection extends Collection {
    constructor(settings) {
        super(settings);

        this.metric = null;
        this.properties = null;
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
                countries.forEach(country => {
                    country.value = null;
                    this.models[country.id] = country;
                });
            });
    }

    loadMetrics() {
        var metric = this.settings.metric;
        var properties = {};
        Object.keys(this.settings.properties).forEach(property => {
            properties[property] = this.settings.properties[property]
        });

        var promise = ((metric === this.metric) && Object.keys(properties).every(property => properties[property] == this.properties[property])) ?
            Promise.resolve(this.data) :
            TimeSeries.getAllByIndicator(metric, properties);

        return promise.then(data => {
            this.metric = metric;
            this.data = data;

            this.data.forEach(timeSeries => {
                this.models[timeSeries.countryCode].value = timeSeries[this.settings.year];
            });
        });
    }
}

module.exports = CountriesCollection;