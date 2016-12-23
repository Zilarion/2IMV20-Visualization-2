'use strict';

var Controller = require('../Controller');
var MaterialSelectfield = require('../MaterialSelectfield');
var d3 = require('d3');

class Filter extends Controller {
    constructor(container, indicator, filterService) {
        super(container, indicator);

        this.filterService = filterService;
    }

    update() {
        var self = this;

        var fields = this.container
            .select('.mdl-grid')
            .selectAll('.mdl-cell');

        var data = fields
            .data(this.filterService.getMetricAndProperties(), ({field}) => field);

        data
            .exit()
            .remove();

        var field = data
            .enter()
            .append('div')
            .classed('mdl-cell', true)
            .classed('mdl-cell--12-col', true)
            .classed('mdl-selectfield', true)
            .classed('mdl-selectfield--floating-label', true);

        var getFieldId = ({field}) => [this.container.attr('id'), field].join('_');

        var select = field
            .append('select')
            .classed('mdl-selectfield__select', true)
            .attr('id', getFieldId)
            .attr('name', ({field}) => field)
            .attr('value', ({value}) => value)
            .on('change', function () {
                if (this.name === 'metric') {
                    self.filterService.setMetric(this.value)
                } else {
                    this.data.properties[this.name] = this.value;
                }
            });

        select
            .selectAll('option')
            .data(({options}) => options)
            .enter()
            .append('option')
            .attr('value', ({value}) => value)
            .text(({text}) => text);

        field
            .append('label')
            .classed('mdl-selectfield__label', true)
            .attr('for', getFieldId)
            .text(({name}) => name);

        field.each(function() {
            new MaterialSelectfield(this);
        })
    }
}

module.exports = Filter;