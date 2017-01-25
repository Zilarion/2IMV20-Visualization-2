'use strict';

const CountryDistanceController = require('../controllers/CountryDistanceController');
const d3 = require('d3');

const View = require('../core/View');

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
        new CountryDistanceController(this, d3.select('#countryDistance'));
    }
}

module.exports = CountriesView;