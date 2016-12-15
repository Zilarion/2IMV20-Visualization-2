'use strict';

var d3 = require('d3');
var nv = require('nvd3');

class TimeLine {
	constructor(selector, settings) {
		var testData = [
	  	{id: '1960', 'value': 1523},
	  	{id: '1970', 'value': 623},
	  	{id: '1980', 'value': 2410},
	  	{id: '1990', 'value': 723},
	  	{id: '2000', 'value': 2110},
	  	{id: '2010', 'value': 2123}
  	];
		// Load data and set settings
		this.data = [{
			values:	testData,
			key: "country"
		}];
		this.settings = settings;
		this.container = d3.select(selector);

		// Create svg according to settings
		this.svg = this.container
			.append("svg")
			.attr("height", 50)
			.attr("width", "100%")
			// .attr("preserveAspectRatio", "xMinYMin meet")
	  	// .attr("viewBox", "0 0 " + this.settings.w + " " + this.settings.h)
	  	// .classed('svg-content-responsive', true)

  	var chart = nv.models.lineChart()
  		.margin({left: 0, bottom: 20, top: 0, right: 0 })
  		.useInteractiveGuideline(true) 
      .showLegend(false)   
  		.showXAxis(true)
  		.showYAxis(true)
  		.x(function(d) {
  			return d.id;
  		})
  		.y(function(d) {
  			return d.value;
  		})

		chart.xAxis
			.axisLabel('Year').tickPadding(20);

		chart.yAxis
			.axisLabel('Value').tickPadding(20);

	  var that = this;
	  nv.addGraph(function() {
			nv.utils.windowResize(function() { chart.update() })

			that.svg.datum(that.data).call(chart);
			return chart;
	  });
	}
}


module.exports = TimeLine;