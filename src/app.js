requirejs.config({
    //By default load any module IDs from src folder
    baseUrl: 'src'
});

// Start the main app logic.
requirejs(['visualization/WorldMap'],
function(map) {
	var mapSettings = {
		w: 1920,
		h: 1080,
		container: "div#container"
	};
	var data = {};
	map.initialize(data, mapSettings);
});