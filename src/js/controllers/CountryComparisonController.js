'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');
const ElementList = require('../core/ElementList');

class MetricList extends ElementList {
    get data() {
        return this.controller.metrics.asArray();
    }

    get keyMapping() {
        return ({metric}) => metric;
    }

    select() {
        return this.container
            .selectAll('.metric');
    }

    enter(elements) {
        var self = this;

        const metric = elements
            .append('div')
            .classed('metric', true);

        metric
            .append('div')
            .classed('metric__title', true)
            .text((metric) => metric.name);

        metric
            .append('div')
            .classed('metric__values', true);
    }

    exit(elements) {
        elements
            .remove();
    }
}

class ValueList extends ElementList {
    get data() {
        return ({series}) => Object.entries(series);
    }

    get keyMapping() {
        return ([id,]) => id;
    }

    select() {
        return this.container
            .selectWithData()
            .select('.metric__values')
            .selectAll('.metric__value');
    }

    enter(elements) {
        const value = elements
            .append('div')
            .classed('metric__value', true);

        value
            .append('div')
            .classed('metric__country1', true);

        value
            .append('div')
            .text(([id,]) => id);

        value
            .append('div')
            .classed('metric__country2', true);
    }

    exit(elements) {
        elements
            .remove()
    }

    updateElements(elements) {
        elements
            .select('.metric__country1')
            .text(([id,]) => this.controller.country1Values.get(id));

        elements
            .select('.metric__country2')
            .text(([id,]) => this.controller.country2Values.get(id));
    }
}

class CountryComparisonController extends Controller {
    init() {
        this.metricList = new MetricList(
            this,
            this.container
        );

        this.valueList = new ValueList(
            this,
            this.metricList
        );
    }

    update() {
        this.metricList.update();
        this.valueList.update();
    }
}

module.exports = CountryComparisonController;