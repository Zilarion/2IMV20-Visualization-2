'use strict';

const EventEmitter = require('events');
const Model = require('./Model');

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
                this.emit('change');
            });
    }

    loadData() {
        return Promise.resolve();
    }

    get(id, defaultValue) {
        return this.has(id) ? this.models[id] : defaultValue;
    }

    has(id) {
        return this.models.hasOwnProperty(id);
    }

    get length() {
        return Object.keys(this.models).length;
    }

    asArray() {
        return Object.values(this.models);
    }

    asKeyValueArray() {
        return Object.entries(this.models);
    }
}

module.exports = Collection