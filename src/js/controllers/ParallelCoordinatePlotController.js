'use strict';

const Controller = require('../core/Controller');
const d3 = require('d3');
const ElementList = require('../core/ElementList');

class PCP extends ElementList {
    get data() {
        return this.controller.values.asKeyValueArray();
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

        elements.append("path");

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
        // const metrics = this.controller.view.metric;
        //
        // const projection = d3.geo
        //     .mercator()
        //     .scale(250)
        //     .translate([1920 / 2, 1080 / 2 + 200]);
        //
        // const geoPath = d3.geo
        //     .path()
        //     .projection(projection);
        //
        // elements
        //     .attr('d', (country) => {
        //         return geoPath({type: 'MultiPolygon', coordinates: country.coordinates});
        //     });
        //
        // if (!metric) {
        //     return;
        // }
        //
        // const color = d3.scale
        //     [metric.scale]()
        //     .domain([metric.minValue, metric.maxValue])
        //     .range([d3.rgb("#0000FF"), d3.rgb('#FF0000')])
        //     .interpolate(d3.interpolateHcl);
        //
        // elements
        //     .attr('fill', ({code}) => {
        //         const value = this.getValue(code);
        //
        //         return value !== null ? color(value) : '#FFFFFF';
        //     });
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