'use strict';

var d3 = require('d3');
var nv = require('nvd3');

class TimeLine {
	constructor(data, settings) {
		// Load data and set settings
		this.data = [{
			values:	data,
			key: "country"
		}];
		this.settings = settings;
		this.container = d3.select(settings.container);

		// Create svg according to settings
		this.svg = this.container
			.append("svg")
			.attr("height", 200)
			// .attr("preserveAspectRatio", "xMinYMin meet")
	  // 	.attr("viewBox", "0 0 " + this.settings.w + " " + this.settings.h)
	  // 	.classed('svg-content-responsive', true)

  	var chart = nv.models.lineChart()
  		.margin({left: 100})
  		.useInteractiveGuideline(true) 
      .showLegend(true)   
  		.showYAxis(true)
  		.showYAxis(true)
  		.x(function(d) {
  			return d.id;
  		})
  		.y(function(d) {
  			return d.value;
  		})

		chart.xAxis
			.axisLabel('Year');

		chart.yAxis
			.axisLabel('Value');

	  var that = this;
	  nv.addGraph(function() {
			nv.utils.windowResize(function() { chart.update() })

			that.svg.datum(that.data).call(chart);
			return chart;
	  });
	}
}


module.exports = TimeLine;