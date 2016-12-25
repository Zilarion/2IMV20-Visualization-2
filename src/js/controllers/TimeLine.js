'use strict';

var Controller = require('../Controller');
var d3 = require('d3');
var nv = require('nvd3');

class TimeLine extends Controller {
    init() {
        this.slider = this.container
            .append('input')
            .attr('type', 'range')
            .attr('min', 1960)
            .attr('max', 2016)
            .attr('step', 1)
            .classed('mdl-slider', true)
            .classed('mdl-js-slider', true);

        this.slider.on('change', () => {
            this.data.year = parseInt(this.slider.property('value'));
        });

        this.update();
    }

    update() {
        this.slider.property('value', this.data.year);
    }
}

module.exports = TimeLine;