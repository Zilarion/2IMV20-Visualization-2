'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');
const ElementList = require('../core/ElementList');
const MaterialSelectfield = require('../mdl/MaterialSelectfield');

class OptionList extends ElementList {
    get data() {
        return this.controller.countries.asArray();
    }

    get keyMapping() {
        return ({code}) => code;
    }

    select() {
        return this.container
            .selectAll('option');
    }

    enter(elements) {
        elements
            .append('option')
            .attr('value', ({code}) => code)
    }

    exit(elements) {
        elements
            .remove()
    }

    updateElements(elements) {
        elements
            .text(({name}) => name);
    }
}

class CountrySelectionController extends Controller {
    init() {
        const self = this;

        this.country1Select = this.container
            .append('div')
            .classed('mdl-selectfield', true)
            .classed('mdl-selectfield--floating-label', true);

        this.country1Select.append('select')
            .classed('mdl-selectfield__select', true)
            .attr('id', 'countrySelectionCountry1')
            .on('change', function () {
                self.data.country1.code = this.value;
            });

        this.country1Select
            .append('label')
            .classed('mdl-selectfield__label', true)
            .attr('for', 'countrySelectionCountry1')
            .text('Country');

        this.country1OptionList = new OptionList(
            this,
            this.country1Select.select('select')
        );

        new MaterialSelectfield(this.country1Select[0][0]);

        this.country2Select = this.container
            .append('div')
            .classed('mdl-selectfield', true)
            .classed('mdl-selectfield--floating-label', true);

        this.country2Select.append('select')
            .classed('mdl-selectfield__select', true)
            .attr('id', 'countrySelectionCountry2')
            .on('change', function () {
                self.data.country1.code = this.value;
            });

        this.country2Select
            .append('label')
            .classed('mdl-selectfield__label', true)
            .attr('for', 'countrySelectionCountry2')
            .text('Country');

        this.country2OptionList = new OptionList(
            this,
            this.country2Select.select('select')
        );

        new MaterialSelectfield(this.country2Select[0][0]);
    }

    update() {
        this.country1OptionList.update();
        this.country1Select.select('select').property('value', this.data.country1.code);
        this.country2OptionList.update();
        this.country2Select.select('select').property('value', this.data.country2.code);
    }
}

module.exports = CountrySelectionController;