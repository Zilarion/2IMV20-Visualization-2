define(function() {
	return {
		initialize: function(settings) {
			this.settings = settings;
			this.container = d3.select(settings.container);
			var aspect = settings.w / settings.h;

			this.svg = this.container
				.append("svg")
				.attr("width", this.settings.w)
				.attr("height", this.settings.h)
				.attr("ar", aspect)
				.attr("preserveAspectRatio", "xMinYMid")
		  	.attr("viewBox", "0 0 " + this.settings.w + " " + this.settings.h)
		  	.classed("svg-element", true);

	  	 var albersProjection = d3.geoMercator()
	      .scale( 250 )
	      // .rotate( [71.057,0] )
	      // .center( [0, 42.313] )
	      .translate( [this.settings.w/2,this.settings.h/2 + 200] );

	    var geoPath = d3.geoPath()
		        .projection( albersProjection );

	    this.svg.selectAll( "path" )
	      .data( world.features )
	      .enter()
	      .append( "path" )
	      .attr( "stroke", "#ccc" )
	      .attr( "fill", "none" )
	      .attr( "d", geoPath );

	    $(window).on("resize", function(e) {
				var targetWidth = $("div#container").width();
		    var svg = d3.select(".svg-element");
		    var aspect = svg.attr("ar");
		    var targetHeight = Math.round(targetWidth / aspect)
		    svg.attr("width", targetWidth);
		    svg.attr("height", targetHeight);
			}).trigger("resize");
		}	
	}
});