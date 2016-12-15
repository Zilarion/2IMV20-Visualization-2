'use strict';

var d3 = require('d3');
var earth = require('../maps/earth')

class WorldMap {
    constructor(selector, settings) {
        this.container = d3.select(selector)
            .classed('svg-container', true);

        this.settings = settings;

        this.svg = this.container
            .append('svg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', '0 0 1920 1080')
            .classed('svg-content-responsive', true);

        this.tooltip = this.container
            .append('div')
            .attr('class', 'hidden tooltip');

        this.countries = this.svg
            .selectAll('.countries')
            .data(earth.features)
            .enter()

        this.countries = this.countries
            .append('path')
            .attr('class', (d) => {
                return 'country ' + d.id;
            })
            .on('mousemove', (d) => {
                // Once we enter a country, update the tooltip
                var mouse = d3.mouse(that.container.node());

                this.tooltip
                    .classed('hidden', false)
                    .attr('style', 'left:' + (mouse[0] + 15) + 'px;' + 'top:'  + (mouse[1] - 35) + 'px')
                    .html(d.properties.name);
            })
            .on('mouseout', () => {
                // Hide the tooltip
                this.tooltip.classed('hidden', true);
            });

        // Initialize projection
        var projection = d3.geo
            .mercator()
            .scale(250)
            .translate([1920 / 2, 1080 / 2 + 200]);

        var geoPath = d3.geo
            .path()
            .projection(projection);

        this.countries
            .attr('d', geoPath);
    }
}

module.exports = WorldMap;
