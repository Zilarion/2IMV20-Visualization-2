requirejs.config({
    //By default load any module IDs from src folder
    baseUrl: 'src',

    // Except for:
    paths: {
			d3: "../node_modules/d3/d3",
			nvd3: "../node_modules/nvd3/build/nv.d3",
			// d3.geo: "node_modules/d3-geo/build/d3-geo",
			jquery: "../node_modules/jquery/dist/jquery",
			topojson: "../node_modules/topojson/dist/topojson"
		},

		// These modules don't support AMD, so use shim
		shim: {
			'd3': {
				exports: "d3"
			},
			'nvd3': {
				deps: ['d3']
			}
		}
});

// Start the main app logic.
requirejs(['visualization/WorldMap', 'visualization/Timeline'],
function(map, timeline) {
	var mapSettings = {
		w: 1920,
		h: 1080,
		container: "div#worldmap"
	};
	var data = {};
	map.initialize(data, mapSettings);

  timelineData = [
  	{id: '1960', 'value': 1523},
  	{id: '1970', 'value': 623},
  	{id: '1980', 'value': 2410},
  	{id: '1990', 'value': 723},
  	{id: '2000', 'value': 2110},
  	{id: '2010', 'value': 2123}
  ];
	timeline.initialize(timelineData, {
		container: "div#timeline"
	});
});