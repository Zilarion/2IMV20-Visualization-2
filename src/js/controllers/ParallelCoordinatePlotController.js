'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');
const ElementList = require('../core/ElementList');

class PCP extends ElementList {
    get data() {
        return this.controller.values.asKeyValueArray();
    }

    get metrics() {
        if (!this.data[0]) {
            return [];
        }

        let metrics = [];
        let data = this.data[0][1] ? this.data[0][1] : [];
        for (let metricId in data) {
            metrics.push(this.controller.view.metrics.get(data[metricId].metric));
        }
        return metrics;
    }

    get keyMapping() {
        return ([countryCode,]) => countryCode;
    }

    select() {
        return this.container
            .selectAll('path');
    }

    enter(elements) {
        var self = this;
        
        // Add grey background lines for context.


        // elements.append("path");

        // svg.append("g")
        //     .attr("class", "background")
        //     .selectAll("path")
        //     .data(cars)
        //     .enter().append("path")
        //     .attr("d", path);
        //
        // // Add blue foreground lines for focus.
        // svg.append("g")
        //     .attr("class", "foreground")
        //     .selectAll("path")
        //     .data(cars)
        //     .enter().append("path")
        //     .attr("d", path);

    }

    exit(elements) {
        elements
            .remove()
    }

    updateElements(elements) {
        const metrics = this.metrics;

        if (!metrics) {
            return;
        }

        let scales = {};

        metrics.forEach((metric) => {
            const x = d3.scale.ordinal()
                .domain([0, metrics.length - 1])
                .rangePoints([50, 1870]); // 20 padding
            const y = d3.scale
                [metric.scale]()
                .domain([metric.minValue, metric.maxValue])
                .range([1030, 50]); // 50 padding

            return scales[metric.metric] = {id: Object.keys(scales).length, x: x, y: y};
        });

        Object.keys(scales).forEach((key) => {
            const metricScale = scales[key];
            const axis = d3.svg.axis().orient("left");

            const g = this.container.append("g")
                .attr("transform", "translate(" + metricScale.x(metricScale.id) + ")");

            g.append("g")
                .attr("class", "axis")
                .call(axis.scale(metricScale.y))
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d; });
        });


    }
}

class ParallelCoordinatePlotController extends Controller {
    init() {
        this.tooltip = this.container
            .append('div')
            .classed('mdl-tooltip', true);

        this.tooltip
            .append('span')
            .classed('flag-icon', true);

        this.tooltip
            .append('span')
            .classed('country', true);

        this.tooltip
            .append('span')
            .classed('value', true);

        this.pcp = new PCP(
            this,
            this.container.select('svg')
        );
    }

    update() {
        this.pcp.update();
    }
}

module.exports = ParallelCoordinatePlotController;