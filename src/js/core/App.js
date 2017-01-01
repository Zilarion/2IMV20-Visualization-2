'use strict';

const CountriesCollection = require('../collections/CountriesCollection');
const CountryView = require('../views/CountryView');
const d3 = require('d3');
const MetricsCollection = require('../collections/MetricsCollection');
const MetricView = require('../views/MetricView');
const WorldView = require('../views/WorldView');

class App {
    constructor() {
        this.countries = new CountriesCollection();
        this.metrics = new MetricsCollection();

        this.views = {
            countryView: new CountryView(this, d3.select('#countryview')),
            metricView: new MetricView(this, d3.select('#metricview')),
            worldView: new WorldView(this, d3.select('#worldview'))
        };
    }

    load() {
        Promise.all([
            this.countries.load(),
            this.metrics.load()
        ]).then(() => {
            this.show('worldView');
        });
    }

    show(viewName, ...settings) {
        Object.values(this.views)
            .forEach(view => {
                view.container.classed('hidden', true);
            });

        this.views[viewName].show(...settings);
        this.views[viewName].container.classed('hidden', false);
    }
}

module.exports = App;