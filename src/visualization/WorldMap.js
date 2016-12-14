define(["d3", 'maps/earth'], function(d3, earth) {
	return {
		selected: null,
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
	    this.countries = this.svg.selectAll(".countries").data( earth.features ).enter()

      // Append the path to the country data
	    var that = this;
      this.countries = this.countries.append('path')
        .attr('class', function(d) {
            return 'country ' + d.id;
        })
	      .on('mousemove', function(d) {
	      	// Once we enter a country, update the tooltip
          var mouse = d3.mouse(that.container.node());
          tooltip.classed('hidden', false)
            .attr('style', 'left:' + (mouse[0] + 15) + 'px;' +
                    			 'top:'  + (mouse[1] - 35) + 'px')
            .html(d.properties.name);
	      })
	      .on('mouseout', function() {
	      	// Hide the tooltip
          tooltip.classed('hidden', true);
	      });

	    // Initialize projection
	    var projection = d3.geo.mercator().scale( 250 ).translate( [this.settings.w/2,this.settings.h/2 + 200] );
      this.setProjection(projection)

      this.update();
		},
		setProjection: function(projection) {
			var geoPath = d3.geo.path().projection(projection);
			this.countries.attr("d", geoPath);
		},
		update: function() {

		}
	}
});