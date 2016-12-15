'use strict';

require('material-design-lite');
require('../../node_modules/getmdl-select/src/js/getmdl-select');

var WorldMap = require('./cards/WorldMap.js');
var TimeLine = require('./cards/TimeLine.js');

new WorldMap('#worldmap', {});
new TimeLine('#timeline', {});