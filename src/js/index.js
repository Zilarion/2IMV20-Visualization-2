'use strict';

require('material-design-lite');

const App = require('./core/App');

const app = new App();
app.load();

window.app = app;