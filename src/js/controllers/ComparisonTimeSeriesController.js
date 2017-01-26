'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');

class ComparisonTimeSeriesController extends Controller {
    init() {
        this.padding = 50;
        this.svg = this.container.select('svg');

        this.country1Line = this.svg.append('path');
        this.country2Line = this.svg.append('path');

        this.xAxis = this.svg.append("g").attr('class', "axis");
        this.yAxis = this.svg.append("g").attr('class', "axis");

        var linear = d3.scale.linear()
            .domain([0,10])
            .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]);

        this.svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(" + (1920 - this.padding) + "," + this.padding + ")");

        var legendLinear = d3.legend.color()
            .shapeWidth(30)
            .orient('horizontal')
            .scale(linear);

        this.svg.select(".legendLinear")
            .call(legendLinear);
    }

    update() {
        const metric = this.view.metric;

        if (!metric) {
            return;
        }

        const x = d3.scale
            [metric.scale]()
            .domain([1960, 2015])
            .range([this.padding, 1920 - this.padding]);
        const y = d3.scale
            [metric.scale]()
            .domain([metric.minValue, metric.maxValue])
            .range([1080 - this.padding, this.padding]);

        this.xAxis
            .attr("transform", "translate(0," + (1080 - this.padding) + ")")
            .call(d3.svg.axis()
                .scale(x)
                .orient("bottom"));

        this.yAxis
            .attr("transform", "translate(" + this.padding + ", 0)")
            .call(d3.svg.axis()
                .scale(y)
                .orient("left"));

        const line = d3.svg.line()
            .x(([year,]) => x(parseInt(year)))
            .y(([,value]) => y(value));

        this.country1Line
            .attr("data-legend", this.data.country1.get("code"))
            .attr('d', line(this.country1Values.asKeyValueArray().filter(([,value]) => value !== null)))
            .attr("stroke", "#fc8d59");
        this.country2Line
            .attr("data-legend", this.data.country2.get("code"))
            .attr('d', line(this.country2Values.asKeyValueArray().filter(([,value]) => value !== null)))
            .attr("stroke", "#91bfdb");


    }
}

module.exports = ComparisonTimeSeriesController;