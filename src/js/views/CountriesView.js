'use strict';

const CountryDistanceController = require('../controllers/CountryDistanceController');
const ParallelCoordinatePlotController = require('../controllers/ParallelCoordinatePlotController');
const MetricSeriesCollection = require('../collections/MetricSeriesCollection');
const d3 = require('d3');

const View = require('../core/View');


const DEFAULT_YEAR = 2015;

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

    init() {
        this.data.year = DEFAULT_YEAR;
        this.data.metrics = ['ny.gdp.mktp.cd', 'SP.DYN.LE00.FE.IN'];


        this.values = new MetricSeriesCollection(this.data);

        new ParallelCoordinatePlotController(this, d3.select('#pcp'),  {values: this.values});
        new CountryDistanceController(this, d3.select('#countryDistance'));
    }
}

module.exports = CountriesView;