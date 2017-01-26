'use strict';

const d3 = require('d3');
const FilterController = require('../controllers/FilterController');
const Model = require('../core/Model');
const TimeLineController = require('../controllers/TimeLineController');
const TopListController = require('../controllers/TopListController');
const View = require('../core/View');
const ValuesCollection = require('../collections/ValuesCollection');
const WorldMapController = require('../controllers/WorldMapController');

const DEFAULT_METRIC = 'inflation';
const DEFAULT_YEAR = 2015;

class WorldView extends View {
    get name() {
        return 'World Map';
    }
    get icon() {
        return 'public';
    }
    get routingTemplate() {
        return '/world-map/:metric/:year'
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
        this.values = new ValuesCollection(this.data);

        new FilterController(this, this.container.select('.filter'), {data: this.data, metrics: this.metrics});
        new WorldMapController(this, this.container.select('#worldmap'), {countries: this.countries, values: this.values});
        new TimeLineController(this, this.container.select('.timeline'), {data: this.data});

        this.highestController = new TopListController(this, this.container.select('#highest'), {countries: this.countries, values: this.values, highest: true});
        this.lowestController = new TopListController(this, this.container.select('#lowest'), {countries: this.countries, values: this.values, highest: false});
    }

    show({metric, year, properties}) {
        if (metric) {
            this.setMetric(metric);
        }

        if (year) {
            this.data.year = year;
        }

        if (properties) {
            this.data.properties = properties;
        }
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

module.exports = WorldView;