'use strict';

const Model = require('./Model');

class View {
    constructor(app, container) {
        this.app = app;
        this.container = container;
        this.data = Model.create();
        this.init();
    }

    init() {}

    show() {}
}

module.exports = View;