'use strict';

require('material-design-lite');

var CountriesCollection = require('./collections/CountriesCollection');
var d3 = require('d3');
var Filter = require('./controllers/Filter');
var FilterService = require('./services/FilterService');
var MaterialSelectfield = require('./MaterialSelectfield');
var Model = require('./Model');
var TimeLine = require('./controllers/TimeLine.js');
var WorldMap = require('./controllers/WorldMap.js');
var WorldValuesCollection = require('./collections/WorldValuesCollection');

window.componentHandler.register({
    constructor: MaterialSelectfield,
    classAsString: 'MaterialSelectfield',
    cssClass: 'mdl-js-selectfield',
    widget: true
});

var filterService = new FilterService();
var time = Model.create({year: 2015});

new Filter(d3.select('#filter'), filterService.indicator, filterService);

new WorldMap(d3.select('#worldmap'), new CountriesCollection(filterService.indicator, time));

new TimeLine(d3.select('#timeline'), new WorldValuesCollection(filterService.indicator), time);