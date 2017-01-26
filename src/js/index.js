'use strict';

require('material-design-lite');
window.d3 = require('d3');
require('d3-svg-legend');

const App = require('./core/App');

let app = new App();
app.load();

window.app = app;