'use strict';

const CountryDistanceController = require('../controllers/CountryDistanceController');
const ParallelCoordinatePlotController = require('../controllers/ParallelCoordinatePlotController');
const MetricSeriesCollection = require('../collections/MetricSeriesCollection');
const ButtonController = require('../controllers/ButtonController');
const d3 = require('d3');

const View = require('../core/View');


const DEFAULT_YEAR = 2015;
const DEFAULT_METRICS = ['SE.ADT.LITR.MA.ZS', 'NY.GDP.MKTP.CD', 'FP.CPI.TOTL.ZG'];

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
        this.data.year = DEFAULT_YEAR;
        this.data.metrics = DEFAULT_METRICS;
        let self = this;

        this.values = new MetricSeriesCollection(this.data);

        // this.metricController = new SelectController(
        //     this,
        //     this.container.select('#metricFilter'),
        //     {
        //         options: function() { return self.metrics.map((key, value) => {
        //             console.log(self.metrics)
        //         })},
        //         metrics: this.setMetric
        //     }
        // );
        // this.propertyController = new SelectController(
        //     this,
        //     this.container.select('#propertyFilter'),
        //     {
        //         data: this.data,
        //         options: function() { return self.activeMetric ? self.activeMetric.properties : []; },
        //         callback: this.setProperty
        //     }
        // );
        this.buttonController = new ButtonController(this, this.container.select('#add-metric'), {callback: this.addSeries});

        new ParallelCoordinatePlotController(this, d3.select('#pcp'),  {countries: this.countries, values: this.values});
        new CountryDistanceController(this, d3.select('#countryDistance'));
    }

    setMetric(metric) {
        let metricModel = this.metrics.models[metric];
        this.activeMetric = metricModel;

        if (metricModel.series) {
            // console.log(this.activeSeries);
            this.activeSeries = metricModel.id;
        } else {
            // TODO: add property support
            // let properties = self.metrics.models[this.activeMetric].properties;
        }
    }

    setProperty(property) {

    }

    addSeries(self) {
        // console.log(self.activeSeries);
        if (!self.activeSeries) {
            return;
        }
        if (self.data.metrics.indexOf(self.activeSeries) > -1) {
            self.data.metrics.push(self.activeSeries);
        }
    }
}

module.exports = CountriesView;