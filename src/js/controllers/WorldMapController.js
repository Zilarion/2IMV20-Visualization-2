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
        var self = this;

        elements
            .append('path')
            .on('mousemove', function (country) {
                d3.select(this)
                    .each(function () {
                    this.parentNode.appendChild(this);
                });

                const mouse = d3.mouse(self.controller.container.node());

                const value = self.getValue(country.code);

                self.controller.tooltip
                    .classed('is-active', true)
                    .style({
                        left: (mouse[0] - (self.controller.tooltip[0][0].offsetWidth / 2)) + 'px',
                        top: (mouse[1] - (self.controller.tooltip[0][0].offsetHeight + 10)) + 'px'
                    });

                const backgroundImage = 'alpha2Code' in country ?
                    `url('/img/flags/${country.alpha2Code.toLowerCase()}.svg')` :
                    null;

                self.controller.tooltip
                    .select('span.flag-icon')
                    .classed('hidden', !('alpha2Code' in country))
                    .style('background-image', backgroundImage);

                self.controller.tooltip
                    .select('span.country')
                    .text(country.name);

                self.controller.tooltip
                    .select('span.value')
                    .classed('hidden', value === null)
                    .text(d3.format('.4s')(value));
            })
            .on('mouseout', () => {
                self.controller.tooltip.classed('is-active', false);
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
            .range([d3.rgb("#FF0000"), d3.rgb('#00FF00')])
            .interpolate(d3.interpolateHcl);

        elements
            .attr('fill', ({code}) => {
                const value = this.getValue(code);

                return value !== null ? color(value) : '#FFFFFF';
            });

        const legendLinear = d3.legend.color()
            .shapeWidth(30)
            .shapeHeight(25)
            .cells(20)
            .orient('vertical')
            .scale(color)
            .shapePadding(0);

        this.controller.legend
            .call(legendLinear);
    }

    getValue(countryCode) {
        return this.controller.values.get(countryCode, null);
    }
}

class WorldMapController extends Controller {
    init() {
        let height = 1080;
        let padding = 100;
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
            this.container.select('svg')
        );

        this.legend =this.container.select('svg')
            .append('g')
            .attr("class", "legend")
            .attr("transform", `translate(0, ${height - padding - 25*20})`);
    }

    update() {
        this.pathList.update();
    }
}

module.exports = WorldMapController;
