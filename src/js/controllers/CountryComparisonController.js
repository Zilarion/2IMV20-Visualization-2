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
            .classed('metric__country1__bar', true)
            .append('span');

        value
            .append('div')
            .classed('metric__country1__text', true);

        value
            .append('div')
            .classed('metric__value-label', true)
            .text(([id,]) => id);

        value
            .append('div')
            .classed('metric__country2__text', true);

        value
            .append('div')
            .classed('metric__country2__bar', true)
            .append('span');
    }

    exit(elements) {
        elements
            .remove()
    }

    updateElements(elements) {
        const self = this;

        const format = (value) => {
            return value !== null ? d3.format('.4s')(value) : '-';
        };

        const percentage = (metric, value) => {
            if (value === null) {
                return 0;
            }

            return d3.format("%")
                (d3.scale
                [metric.scale]()
                .domain([metric.minValue, metric.maxValue])
                .range([0, 1])(value));
        };

        elements
            .select('.metric__country1__bar span')
            .style('width', function ([id,]) {
                return percentage(d3.select(this.parentNode.parentNode.parentNode.parentNode).data()[0], self.controller.country1Values.get(id, null));
            });

        elements
            .select('.metric__country1__text')
            .text(([id,]) => format(this.controller.country1Values.get(id)));

        elements
            .select('.metric__country2__text')
            .text(([id,]) => format(this.controller.country2Values.get(id)));

        elements
            .select('.metric__country2__bar span')
            .style('width', function ([id,]) {
                return percentage(d3.select(this.parentNode.parentNode.parentNode.parentNode).data()[0], self.controller.country1Values.get(id, null));
            });
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
        // this.metricList.update();
        // this.valueList.update();
    }
}

module.exports = CountryComparisonController;