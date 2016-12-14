define(["d3"], function(d3) {
	return {
		initialize: function(data, settings) {
			// Load data and set settings
			this.data = data;
			this.settings = settings;
			this.container = d3.select(settings.container).classed("svg-container", true);

			// Create svg according to settings
			this.svg = this.container
				.append("svg")
				.attr("width", this.settings.w)
				.attr("height", this.settings.h)
				.attr("preserveAspectRatio", "xMinYMin meet")
		  	.attr("viewBox", "0 0 " + this.settings.w + " " + this.settings.h)
		  	.classed('svg-content-responsive', true)

		  // Add hover tooltip
			var tooltip = this.container.append('div').attr('class', 'hidden tooltip');

      // Load all countries
	    this.countries = this.svg.selectAll(".countries").data( world.features ).enter()

	    // Todo: append data
		}
	}
});