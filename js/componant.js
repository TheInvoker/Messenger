var component = function(cm, w, h) {
	
	var jx = cm.hasAttribute("data-jointx") ? parseInt(cm.getAttribute("data-jointx"), 10) : 0;
	var jy = cm.hasAttribute("data-jointy") ? parseInt(cm.getAttribute("data-jointy"), 10) : 0;
	var metaData = {};
	
	var reset = function() {
		transform(0, 1, 1, 0, 0, 0, 0);
	};
	
	var transform = function(degree, scale_x, scale_y, offset_x, offset_y, move_x, move_y) {
		var rad = degree * (Math.PI/180);
		var sx = scale_x;
		var sy = scale_y;
		var cos = Math.cos(rad);
		var sin = Math.sin(rad);
		var cx = jx + offset_x;
		var cy = jy + offset_y;
		var tx = (w * (1 - sx))/2 + move_x;
		var ty = (h * (1 - sy))/2 + move_y;
		var matrix = sprintf('matrix(%f,%f,%f,%f,%f,%f)', sx*cos, sy*sin, -sx*sin, sy*cos, (-cx*cos + cy*sin + cx)*sx + tx, (-cx*sin - cy*cos + cy)*sy + ty);
		cm.setAttribute('transform', matrix);
	};
	
	this.getAttr = function(attr) {
		return metaData[attr];
	};
	
	this.setAttr = function(attr, val) {
		metaData[attr] = val;
	};
	
	this.initMove = function() {
		metaData["speed-x"] = getRandomArbitrary(-2,2);
		metaData["speed-y"] = getRandomArbitrary(2,4);
		metaData["data-px"] = 0;
		metaData["data-py"] = 0;
	};
	
	this.transform = function(degree, scale_x, scale_y, offset_x, offset_y, move_x, move_y) {
		transform(degree, scale_x, scale_y, offset_x, offset_y, move_x, move_y);
	};
	
	this.getPosition = function() {
		return cm.getBoundingClientRect();
	};
	
	this.getWidth = function() {
		return cm.getBBox().width;
	};
	
	this.getHeight = function() {
		return cm.getBBox().height;
	};
	
	this.reset = function() {
		reset();
	};
	
	this.animate = function(type) {
		reset();
		
		switch(type) {
			case 'fly':
				fly();
				break;
			default:
				return false;
		} 
		
		return true;
	};
};