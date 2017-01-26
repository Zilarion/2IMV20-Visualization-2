'use strict';

const ComparisonTimeSeriesController = require('../controllers/ComparisonTimeSeriesController');
const CountryComparisonController = require('../controllers/CountryComparisonController');
const CountrySelectionController = require('../controllers/CountrySelectionController');
const CountryValuesCollection = require('../collections/CountryValuesCollection');
const FilterController = require('../controllers/FilterController');
const Model = require('../core/Model');
const TimeLineController = require('../controllers/TimeLineController');
const TimeSeriesCollection = require('../collections/TimeSeriesCollection');
const View = require('../core/View');

const DEFAULT_METRIC = 'inflation';
const DEFAULT_YEAR = 2015;
const DEFAULT_COUNTRY1 = 'NLD';
const DEFAULT_COUNTRY2 = 'USA';

class ComparisonView extends View {
    get name() {
        return 'Country comparison';
    }
    get icon() {
        return 'compare_arrows';
    }

    get routingTemplate() {
        return '/country-comparison/:country1-:country2';
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
        this.data.country1 = Model.create({code: DEFAULT_COUNTRY1});
        this.data.country2 = Model.create({code: DEFAULT_COUNTRY2});

        this.country1Data = Model.create({country: this.data.country1, data: this.data});
        this.country2Data = Model.create({country: this.data.country2, data: this.data});

        this.country1TimeSeries = new TimeSeriesCollection(this.country1Data);
        this.country2TimeSeries = new TimeSeriesCollection(this.country2Data);
        this.country1Values = new CountryValuesCollection(this.country1Data);
        this.country2Values = new CountryValuesCollection(this.country2Data);

        this.filterController = new FilterController(this, this.container.select('.filter'), {data: this.data, metrics: this.metrics});
        this.comparisonTimeSeriesController = new ComparisonTimeSeriesController(this, this.container.select('#countries-timeseries'), {country1Values: this.country1TimeSeries, country2Values: this.country2TimeSeries, data: this.data});
        this.timeLineController = new TimeLineController(this, this.container.select('.timeline'), {data: this.data});
        this.countrySelectionController = new CountrySelectionController(this, this.container.select('#countrySelection'), {countries: this.countries, data: this.data});
        this.countryComparisonController = new CountryComparisonController(this, this.container.select('#countryComparison'), {metrics: this.metrics, country1Values: this.country1Values, country2Values: this.country2Values});
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
}

module.exports = ComparisonView;