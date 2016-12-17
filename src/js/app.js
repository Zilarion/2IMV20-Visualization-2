'use strict';

require('material-design-lite');
require('../../node_modules/getmdl-select/src/js/getmdl-select');

var CountriesCollection = require('./collections/CountriesCollection');
var d3 = require('d3');
var FilterService = require('./services/FilterService');
var Model = require('./Model');
var TimeLine = require('./controllers/TimeLine.js');
var WorldMap = require('./controllers/WorldMap.js');
var WorldValuesCollection = require('./collections/WorldValuesCollection');

var filterService = new FilterService();
var time = Model.create({year: 2016});

new WorldMap(d3.select('#worldmap'), new CountriesCollection(filterService.indicator, time));

new TimeLine(d3.select('#timeline'), new WorldValuesCollection(filterService.indicator), time);