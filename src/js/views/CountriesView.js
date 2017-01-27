'use strict';

const CountryDistanceController = require('../controllers/CountryDistanceController');
const ParallelCoordinatePlotController = require('../controllers/ParallelCoordinatePlotController');
const MetricSeriesCollection = require('../collections/MetricSeriesCollection');
const ButtonController = require('../controllers/ButtonController');
const FilterController = require('../controllers/FilterController');
const Model = require('../core/Model');
const d3 = require('d3');

const View = require('../core/View');


const DEFAULT_YEAR = 2015;
const DEFAULT_METRICS = [];// ['SE.ADT.LITR.MA.ZS', 'NY.GDP.MKTP.CD', 'FP.CPI.TOTL.ZG'];
const DEFAULT_METRIC = 'inflation';

class CountriesView extends View {
    get name() {
        return 'Countries';
    }
    get icon() {
        return 'flag';
    }

    get routingTemplate() {
        return '/countries';
    }

    get countries() {
        return this.app.countries;
    }

    get metrics() {
        return this.app.metrics;
    }

    get metric() {
        return this.metrics.get(this.data.metric);
    }

    init() {
        this.setMetric(DEFAULT_METRIC);
        this.data.year = DEFAULT_YEAR;
        this.data.metrics = DEFAULT_METRICS;

        this.values = new MetricSeriesCollection(this.data);

        this.filterController = new FilterController(this, this.container.select('.filter'), {data: this.data, metrics: this.metrics});
        this.buttonController = new ButtonController(this, this.container.select('#add-metric'), {callback: this.addSeries});

        this.pcpController = new ParallelCoordinatePlotController(this, d3.select('#pcp'),  {data: this.data, countries: this.countries, values: this.values});
        new CountryDistanceController(this, d3.select('#countryDistance'));
    }

    setMetric(metric) {
        this.data.metric = metric;

        let propertyValues = {};

        if (this.metric) {
            let properties = this.metric.properties;

            Object.keys(properties).forEach((property) => {
                propertyValues[property] = properties[property].defaultValue;
            });
        }

        this.data.properties = Model.create(propertyValues);
    }

    removeMetric(metric) {
        let result = [];
        for (let key in this.data.metrics) {
            if (this.data.metrics[key].id !== metric) {
                result.push(this.data.metrics[key]);
            }
        }
        this.data.metrics = result;
    }

    addSeries(self) {
        let metricName = self.data.metric;
        let properties = self.data.properties;
        let keys = properties.ownKeys();
        // console.log(metric, properties.ownKeys());

        let metric = self.metrics.models[metricName];

        // console.log(metric);

        if(keys.length === 0) {
            // Use first series, no properties for this metric
            Object.keys(metric.series).forEach((key) => {
                // Add all the series (should be 1).
                let newmetrics = self.data.metrics;

                for (let i in newmetrics) {
                    let met = newmetrics[i];
                    if (met.id === key) {
                        return;
                    }
                }
                newmetrics.push({name: metricName, id: key});
                self.data.metrics = newmetrics;
            })
        } else {
            // Use active property
        }
    }
}

module.exports = CountriesView;