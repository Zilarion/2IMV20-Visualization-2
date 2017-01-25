'use strict';

var Controller = require('../core/Controller');
var d3 = require('d3');

class ValuedSlider extends window.MaterialSlider {
    init() {
        super.init();

        if (this.element_) {
            this.valueContainer_ = document.createElement('div');
            this.valueContainer_.classList.add('mdl-slider__value-container');
            this.value_ = document.createElement('div');
            this.value_.classList.add('mdl-slider__value');
            this.valueContainer_.appendChild(this.value_);
            this.element_.parentElement.insertBefore(this.valueContainer_, this.element_);
        }
    }

    updateValueStyles_() {
        super.updateValueStyles_();

        if (this.value_) {
            var fraction = (this.element_.value - this.element_.min) /
                (this.element_.max - this.element_.min);

            this.value_.innerText = this.element_.value;
            this.value_.style.left = (fraction*100) + '%';
        }
    }
}

class TimeLineController extends Controller {
    init() {
        this.slider = this.container
            .append('input')
            .attr('type', 'range')
            .attr('min', 1960)
            .attr('max', 2015)
            .attr('step', 1)
            .classed('mdl-slider', true);

        this.valuedSlider = new ValuedSlider(this.slider[0][0]);

        this.slider.on('input', () => {
            this.data.year = parseInt(this.slider.property('value'));
        });
    }

    update() {
        this.slider.property('value', this.data.year);
        this.valuedSlider.updateValueStyles_();
    }
}

module.exports = TimeLineController;