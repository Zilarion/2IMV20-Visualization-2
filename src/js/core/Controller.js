'use strict';

var EventEmitter = require('events');

class Controller {
    constructor(view, container, data={}) {
        this.view = view;
        this.container = container;

        Object.entries(data)
            .forEach(([key, value]) => {
                this[key] = value;

                if (value instanceof EventEmitter) {
                    value.on('change', () => {
                        this.update();
                    });
                }
            });

        this.init();

        this.update();
    }

    init() {}

    update() {}
}

module.exports = Controller;