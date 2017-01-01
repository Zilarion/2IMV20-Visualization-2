'use strict';

const Collection = require('../core/Collection');
const MetricsDAO = require('../dao/MetricsDAO');

class MetricsCollection extends Collection {
    loadData() {
        return MetricsDAO
            .getAll()
            .then(metrics => {
                this.models = {};

                metrics.forEach((metrics) => {
                    this.models[metrics.metric] = metrics;
                });
            });
    }
}

module.exports = MetricsCollection;