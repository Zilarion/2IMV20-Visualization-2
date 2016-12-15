'use strict';

require('material-design-lite');
require('../../node_modules/getmdl-select/src/js/getmdl-select');

var d3 = require('d3');
var FilterService = require('./services/FilterService');
var Model = require('./Model');
var WorldMap = require('./controllers/WorldMap.js');
//var TimeLine = require('./cards/TimeLine.js');

var filterService = new FilterService();

var countries = new CountriesCollection(filterService.filter);
new WorldMap(d3.select('#worldmap'), countries);

//new TimeLine('#timeline', {});