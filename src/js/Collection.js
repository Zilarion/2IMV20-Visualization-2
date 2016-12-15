'use strict';

var EventEmitter = require('events');
var Model = require('./Model');

class Collection extends EventEmitter {
    constructor(settings) {
        super();

        this.settings = settings || Model.create({});
        this.models = {};

        this.settings
            .on('change', () => {
                this.load()
            });

        this.load();
    }

    load() {
        this
            .loadData()
            .then(() => {
                emit('change');
            });
    }

    loadData() {
        return Promise.resolve();
    }

    get(id) {
        return this.models[id];
    }

    has(id) {
        return Object.hasOwnProperty(this.models, id);
    }

    get length() {
        return Object.keys(this.models).length;
    }

    asArray() {
        return Object.values(this.models);
    }
}

module.exports = Collection