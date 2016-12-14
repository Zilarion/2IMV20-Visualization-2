requirejs.config({
    //By default load any module IDs from src folder
    baseUrl: 'src'
});

// Start the main app logic.
requirejs(['visualization/WorldMap'],
function(map) {
	console.log(map)
	map.initialize({
		w: 1920,
		h: 1080,
		container: "div#container"
	});
});