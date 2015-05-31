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

var transform = function(cm, w, h, degree, base_scale, scale_x, scale_y, offset_x, offset_y, move_x, move_y) {
	var rad = degree * (Math.PI/180);
	var sx = base_scale + scale_x;
	var sy = base_scale + scale_y;
	var cos = Math.cos(rad);
	var sin = Math.sin(rad);
	var cx = w/2 + offset_x;
	var cy = h/2 + offset_y;
	var tx = (w * (1 - sx))/2 + move_x;
	var ty = (h * (1 - sy))/2 + move_y;
	var matrix = sprintf('matrix(%f,%f,%f,%f,%f,%f)', sx*cos, sy*sin, -sx*sin, sy*cos, (-cx*cos + cy*sin + cx)*sx + tx, (-cx*sin - cy*cos + cy)*sy + ty);
	cm.setAttribute('transform', matrix);
};