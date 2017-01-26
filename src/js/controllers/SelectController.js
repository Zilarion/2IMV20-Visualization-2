'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');
const ElementList = require('../core/ElementList');
const MaterialSelectfield = require('../mdl/MaterialSelectfield');

class FieldList extends ElementList {
    get data() {
        const metricField = {
            field: 'metric',
            name: 'Metric',
            value: this.controller.data.metrics,
            options: this.controller.metrics.asArray().map((metric) => {
                return {
                    value: metric.metric,
                    text: metric.name
                };
            })
        };

        const metric = this.controller.view.metric;

        // const propertyFields = Object.entries(this.controller.data.properties)
        //     .map(([property, value]) => {
        //         return {
        //             field: property,
        //             name: metric.properties[property].name,
        //             value: value,
        //             options: Object.entries(metric.properties[property].values)
        //                 .map(([value, content]) => {
        //                     return {
        //                         value: value,
        //                         text: content.name
        //                     };
        //                 })
        //         };
        //     });

        // console.log([metricField].concat(propertyFields))
        return [metricField]//.concat(propertyFields);
    }

    get keyMapping() {
        return ({field}) => field
    }

    select() {
        return this.container
            .selectAll('.mdl-cell');
    }

    enter(elements) {
        var self = this;

        const fields = elements
            .append('div')
            .classed('mdl-cell', true)
            .classed('mdl-cell--12-col', true)
            .classed('mdl-selectfield', true)
            .classed('mdl-selectfield--floating-label', true);

        const getFieldId = ({field}) => [this.container.attr('id'), field].join('_');

        fields.append('select')
            .classed('mdl-selectfield__select', true)
            .attr('id', getFieldId)
            .attr('name', ({field}) => field)
            .on('change', function () {
                if (this.name === 'metric') {
                    self.controller.view.setMetric(this.value);
                } else {
                    self.controller.data.properties[this.name] = this.value;
                }
            });

        fields
            .append('label')
            .classed('mdl-selectfield__label', true)
            .attr('for', getFieldId);

        fields.each(function() {
            new MaterialSelectfield(this);
        });
    }

    exit(elements) {
        elements
            .remove();
    }

    updateElements(elements) {
        elements
            .select('select')
            .property('value', ({value}) => value);

        elements
            .select('label')
            .text(({name}) => name);
    }
}

class OptionList extends ElementList {
    get data() {
        return ({options}) => options;
    }

    get keyMapping() {
        return ({value}) => value;
    }

    select() {
        return this.container
            .selectWithData()
            .select('select')
            .selectAll('option');
    }

    enter(elements) {
        elements
            .append('option')
            .attr('value', ({value}) => value)
    }

    exit(elements) {
        elements
            .remove()
    }

    updateElements(elements) {
        elements
            .text(({text}) => text);
    }
}

class FilterController extends Controller {
    init() {
        this.fieldList = new FieldList(
            this,
            this.container.select('.mdl-grid')
        );

        this.optionList = new OptionList(
            this,
            this.fieldList
        );
    }

    update() {
        this.fieldList.update();
        this.optionList.update();
        // this.fieldList.update(); // Update again, otherwise value is not set correctly
    }
}

module.exports = FilterController;