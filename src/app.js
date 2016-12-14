requirejs.config({
    //By default load any module IDs from src folder
    baseUrl: 'src',

    // Except for:
    paths: {
			d3: "../node_modules/d3/build/d3",
			// d3.geo: "node_modules/d3-geo/build/d3-geo",
			jquery: "../node_modules/jquery/dist/jquery",
			topojson: "../node_modules/topojson/dist/topojson"
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
	{id: '1990', value: '50'},
	{id: '2010', value: '10'},
	{id: '2008', value: '12'},
	{id: '2006', value: '40'},
	{id: '2004', value: '19'},
	{id: '2012', value: '60'},

	]
	timeline.initialize(timelineData, {});
});