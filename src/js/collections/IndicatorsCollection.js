'use strict';

var Collection = require('../Collection');
var Indicators = require('../dao/Indicators');

class IndicatorsCollection extends Collection {
    loadData() {
        return Indicators.getAll()
            .then((indicators) => {
                this.models = {};
                indicators.forEach((indicator) => {
                    this.models[indicator.id] = indicator
                });
            });
    }
}

module.exports = IndicatorsCollection;