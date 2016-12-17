'use strict';

var Controller = require('../Controller');
var d3 = require('d3');
var nv = require('nvd3');

class TimeLine extends Controller {
    constructor(container, indicator, time) {
        super(container, indicator);

        this.time = time;
    }

    init() {
        this.svg = this.container
            .append('svg');

        this.createChart = new Promise((resolve) => {
            nv.addGraph(() => {
                var chart = nv.models
                    .lineChart()
                    .margin({left: 0, bottom: 20, top: 0, right: 0 })
                    .useInteractiveGuideline(true)
                    .showLegend(false)
                    .showXAxis(true)
                    .showYAxis(true)
                    .x(({year}) => year)
                    .y(({value}) => value);

                chart.xAxis
                    .axisLabel('Year')
                    .tickPadding(20);

                chart.yAxis
                    .axisLabel('Value')
                    .tickPadding(20);

                nv.utils.windowResize(() => chart.update());

                return chart;
            }, resolve);
        });
    }

    update() {
        this.createChart.then((chart) => {
            this.svg
                .datum([{
                    values: Object.entries(this.data.models)
                    .map(([year, value]) => {
                        return {year, value};
                    })
                }])
                .call(chart);
        });
    }
}

module.exports = TimeLine;