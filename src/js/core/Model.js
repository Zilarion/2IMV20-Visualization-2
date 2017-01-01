'use strict';

var EventEmitter = require('events');

class Model extends EventEmitter {
    static create(properties) {
        return new Proxy(new Model(properties), {
            get(model, property) {
                if (model.hasOwnProperty(property)) {
                    return model[property];
                }
                return model.get(property) || Model.prototype[property];
            },

            set(model, property, value) {
                model.set(property, value);
                return true;
            },

            has(model, property) {
                return property in model.properties;
            },

            ownKeys(model) {
                return model.ownKeys();
            },

            getPrototypeOf() {
                return Model.prototype;
            }
        });
    }

    constructor(properties={}) {
        super();

        this._properties = properties;
    }

    get(property) {
        return this._properties[property];
    }

    set(property, value) {
        this._properties[property] = value;

        if (value instanceof EventEmitter) {
            value.on('change', () => {
                if (this._properties[property] === value) {
                    this.emit('change', property);
                }
            })
        }

        this.emit('change', property);
    }

    has(property) {
        return Object.hasOwnProperty(this._properties, property);
    }

    ownKeys() {
        return Object.keys(this._properties);
    }
}

module.exports = Model;