define(function() {
	return {
		selected: null,
		initialize: function(data, settings) {
			// Load data and set settings
			this.data = data;
			this.settings = settings;
			this.container = d3.select(settings.container);
			var aspect = settings.w / settings.h;

			// Create svg according to settings
			this.svg = this.container
				.append("svg")
				.attr("width", this.settings.w)
				.attr("height", this.settings.h)
				.attr("ar", aspect)
				.attr("preserveAspectRatio", "xMinYMid")
		  	.attr("viewBox", "0 0 " + this.settings.w + " " + this.settings.h)
		  	.classed("svg-element", true);

		  // Add hover tooltip
			var tooltip = this.container.append('div').attr('class', 'hidden tooltip');

      // Load all countries
	    this.countries = this.svg.selectAll(".countries").data( world.features ).enter()

	    // Todo: append data

      // Append the path to the country data
      this.countries = this.countries.append('path')
        .attr('class', function(d) {
            return 'country ' + d.id;
        })
	      .on('mousemove', function(d) {
	      	// Once we enter a country, update the tooltip
          var mouse = d3.mouse(document.body);
          tooltip.classed('hidden', false)
              .attr('style', 
              				'left:' + (mouse[0] + 15) + 'px;' +
                      'top:'  + (mouse[1] - 35) + 'px')
              .html(d.properties.name);
	      })
	      .on('mouseout', function() {
	      	// Hide the tooltip again
          tooltip.classed('hidden', true);
	      });

	    // Initialize projection
	    var projection = d3.geoMercator().scale( 250 ).translate( [this.settings.w/2,this.settings.h/2 + 200] );
      this.setProjection(projection)


	    // Resize handler
	    $(window).on("resize", function(e) {
				var targetWidth = $("div#container").width();
		    var svg = d3.select(".svg-element");
		    var aspect = svg.attr("ar");
		    var targetHeight = Math.round(targetWidth / aspect)
		    svg.attr("width", targetWidth);
		    svg.attr("height", targetHeight);
			}).trigger("resize");
		},
		setProjection: function(projection) {
			var geoPath = d3.geoPath().projection(projection);
			this.countries.attr("d", geoPath);
		}	
	}
});