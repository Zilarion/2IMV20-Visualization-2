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

        this.tooltip = this.container
            .append('div')
            .classed('mdl-tooltip', true);

        this.tooltip
            .append('span')
            .classed('flag-icon', true);

        this.tooltip
            .append('span')
            .classed('country', true);
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
            .interpolate('basis')
            .x(([year,]) => x(parseInt(year)))
            .y(([,value]) => y(value));

        this.country1Line
            .attr('d', line(this.country1Values.asKeyValueArray().filter(([,value]) => value !== null)));
        this.country2Line
            .attr('d', line(this.country2Values.asKeyValueArray().filter(([,value]) => value !== null)));

        this.attachTooltip(this.country1Line, 'country1');
        this.attachTooltip(this.country2Line, 'country2');
    }

    attachTooltip(element, d) {
        element.on('mousemove', () => {
            const country = this.view.countries.get(this.data[d].code);

            if (!country) {
                return;
            }

            const mouse = d3.mouse(this.container.node());

            this.tooltip
                .classed('is-active', true)
                .style({
                    left: (mouse[0] - (this.tooltip[0][0].offsetWidth / 2)) + 'px',
                    top: (mouse[1] - (this.tooltip[0][0].offsetHeight + 10)) + 'px'
                });

            const backgroundImage = 'alpha2Code' in country ?
                `url('/img/flags/${country.alpha2Code.toLowerCase()}.svg')` :
                null;

            this.tooltip
                .select('span.flag-icon')
                .classed('hidden', !('alpha2Code' in country))
                .style('background-image', backgroundImage);

            this.tooltip
                .select('span.country')
                .text(country.name);
        });

        element.on('mouseout', () => {
            this.tooltip.classed('is-active', false);
        });
    }
}

module.exports = ComparisonTimeSeriesController;