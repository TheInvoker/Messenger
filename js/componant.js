var component = function(svgElement, cm, w, h, base_scale) {
	
	var interval = -1;
	var jx = parseInt(cm.getAttribute("data-jointx"), 10);
	var jy = parseInt(cm.getAttribute("data-jointy"), 10);
	
	var reset = function() {
		clearInterval(interval);
	};
	
	var fly = function() {
		var obj = $(cm);
		obj.attr("speed_x", getRandomArbitrary(-2,2));
		obj.attr("speed_y", getRandomArbitrary(2,4));
		obj.attr("data-px", 0);
		obj.attr("data-py", 0);
		
		var step = 0, rot = 0;
		interval = setInterval(function() { 
			var vx = parseFloat(obj.attr("speed_x")),
				vy = parseFloat(obj.attr("speed_y")),
				px = parseFloat(obj.attr("data-px")),
				py = parseFloat(obj.attr("data-py"));
				
			px += vx;
			py -= vy;
			vy -= 0.1;
			
			transform(cm, w, h, rot, base_scale, 0, 0, 0, 0, px, py);
			
			obj.attr({
				"speed_y" : vy,
				"data-px" : px,
				"data-py" : py
			});
			
			rot += 0.2;
			step += 0.002;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 1500);
	};
	



	
	
	
	
	
	this.getComponent = function() {
		return cm;
	};
	
	this.getJX = function() {
		return jx;
	};
	
	this.getJY = function() {
		return jy;
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