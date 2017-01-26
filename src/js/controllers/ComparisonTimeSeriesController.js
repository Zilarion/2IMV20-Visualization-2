'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');

class ComparisonTimeSeriesController extends Controller {
    init() {
        this.svg = this.container.select('svg');

        this.lines = this.svg
            .append('g')
            .classed('timeSeries__lines', true);

        this.country1Line = this.lines.append('path');
        this.country2Line = this.lines.append('path');

        this.xAxis = this.svg.append('g')
            .classed('timeSeries__axis', true);
        this.yAxis = this.svg.append('g')
            .classed('timeSeries__axis', true);
    }

    update() {
        const metric = this.view.metric;

        if (!metric) {
            return;
        }

        let padding = 50;
        const x = d3.scale
            [metric.scale]()
            .domain([1960, 2015])
            .range([padding, 1920 - padding]);
        const y = d3.scale
            [metric.scale]()
            .domain([metric.minValue, metric.maxValue])
            .range([1080 - padding, padding]);

        this.xAxis
            .attr("transform", "translate(0," + (1080 - padding) + ")")
            .call(d3.svg.axis()
                .scale(x)
                .orient("bottom"));

        this.yAxis
            .attr("transform", "translate(" + padding + ", 0)")
            .call(d3.svg.axis()
                .scale(y)
                .orient("left"));

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