'use strict';

var EventEmitter = require('events');

class Model extends EventEmitter {
    static create(properties) {
        return new Proxy(new Model(properties), {
            get(model, property) {
                return model.get(property);
            },

            set(model, property, value) {
                return model.set(property, value);
            },

            has(model, property) {
                return property in model.properties;
            },

            ownKeys(model) {
                return model.ownKeys();
            },

            getPrototypeOf(model) {
                return Model.prototype;
            }
        });
    }

    constructor(properties) {
        super();
        
        this.properties = properties;
    }

    get(property) {
        return this.properties[property];
    }

    set(property, value) {
        this.properties[property] = value;

        this.emit('change');
    }

    has(property) {
        return Object.hasOwnProperty(this.properties, property);
    }

    ownKeys() {
        return Object.keys(this.properties);
    }
}

module.exports = Model;