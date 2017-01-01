'use strict';

var Controller = require('../core/Controller');
var d3 = require('d3');
const ElementList = require('../core/ElementList');

class PathList extends ElementList {
    get data() {
        return this.controller.countries.asArray();
    }

    get keyMapping() {
        return ({code}) => code;
    }

    select() {
        return this.container
            .selectAll('path');
    }

    enter(elements) {
        elements
            .append('path')
            .on('mousemove', (country) => {
                const mouse = d3.mouse(this.controller.container.node());

                const value = this.getValue(country.code);

                this.controller.tooltip
                    .classed('is-active', true)
                    .style({
                        left: (mouse[0] - (this.controller.tooltip[0][0].offsetWidth / 2)) + 'px',
                        top: (mouse[1] - (this.controller.tooltip[0][0].offsetHeight + 10)) + 'px'
                    });

                this.controller.tooltip
                    .select('span.flag-icon')
                    .classed('hidden', country.alpha2Code === null)
                    .style('background-image', `url('/img/flags/${country.alpha2Code.toLowerCase()}.svg')`);

                this.controller.tooltip
                    .select('span.country')
                    .text(country.name);

                this.controller.tooltip
                    .select('span.value')
                    .classed('hidden', value === null)
                    .text(d3.format('.4s')(value).toUpperCase());
            })
            .on('mouseout', () => {
                this.controller.tooltip.classed('is-active', false);
            });
    }

    exit(elements) {
        elements
            .remove()
    }

    updateElements(elements) {
        const metric = this.controller.view.metric;

        const projection = d3.geo
            .mercator()
            .scale(250)
            .translate([1920 / 2, 1080 / 2 + 200]);

        const geoPath = d3.geo
            .path()
            .projection(projection);

        elements
            .attr('d', (country) => {
                return geoPath({type: 'MultiPolygon', coordinates: country.coordinates});
            });

        if (!metric) {
            return;
        }

        const color = d3.scale
            [metric.scale]()
            .domain([metric.minValue, metric.maxValue])
            .range([d3.rgb("#0000FF"), d3.rgb('#FF0000')])
            .interpolate(d3.interpolateHcl);

        elements
            .attr('fill', ({code}) => {
                const value = this.getValue(code);

                return value !== null ? color(value) : '#FFFFFF';
            });
    }

    getValue(countryCode) {
        return this.controller.values.get(countryCode, null);
    }
}

class WorldMapController extends Controller {
    init() {
        this.svg = this.container
            .append('svg')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', '0 0 1920 1080');

        this.svg
            .append('filter')
            .attr('id', 'inner-shadow')
            .append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', 3);

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

        this.pathList = new PathList(
            this,
            this.svg
        );
    }

    update() {
        this.pathList.update();
    }
}

module.exports = WorldMapController;
