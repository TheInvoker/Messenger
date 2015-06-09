/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function length_dir(len, degree) {
	var rad = degree * (Math.PI/180); 
	var x = len * Math.cos(rad);
	var y = len * Math.sin(rad);
	return [x,y];
}

function getComponents(cm) {
	return $(cm).find("g,path,polygon,polyline");
}