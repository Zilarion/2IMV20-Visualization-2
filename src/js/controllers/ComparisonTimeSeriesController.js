'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');

class ComparisonTimeSeriesController extends Controller {
    init() {
        this.svg = this.container.select('svg');

        this.country1Line = this.svg.append('path');
        this.country2Line = this.svg.append('path');
    }

    update() {
        const metric = this.view.metric;

        if (!metric) {
            return;
        }

        const x = d3.scale
            [metric.scale]()
            .domain([1960, 2015])
            .range([0, 1920]);
        const y = d3.scale
            [metric.scale]()
            .domain([metric.minValue, metric.maxValue])
            .range([1080, 0]);

        const line = d3.svg.line()
            .x(([year,]) => x(parseInt(year)))
            .y(([,value]) => y(value));

        this.country1Line
            .attr('d', line(this.country1Values.asKeyValueArray().filter(([,value]) => value !== null)));
        this.country2Line
            .attr('d', line(this.country2Values.asKeyValueArray().filter(([,value]) => value !== null)));
    }
}

module.exports = ComparisonTimeSeriesController;