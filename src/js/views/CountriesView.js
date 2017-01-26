'use strict';

const CountryDistanceController = require('../controllers/CountryDistanceController');
const ParallelCoordinatePlotController = require('../controllers/ParallelCoordinatePlotController');
const MetricSeriesCollection = require('../collections/MetricSeriesCollection');
const SelectController = require('../controllers/SelectController');
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
        this.setMetrics(DEFAULT_METRICS);

        this.values = new MetricSeriesCollection(this.data);

        this.selectController = new SelectController(this, this.container.select('.filter'), {data: this.data, metrics: this.metrics});

        new ParallelCoordinatePlotController(this, d3.select('.pcp'),  {values: this.values});
        new CountryDistanceController(this, d3.select('#countryDistance'));
    }

    setMetrics(metrics) {
        this.data.metrics = metrics;
    }
}

module.exports = CountriesView;