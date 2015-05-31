var animate = new function() {
	
	var transform = function(cm, degree, scale_x, scale_y, offset_x, offset_y, move_x, move_y) {
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

	var init_explode = function(cm) {
		var projectileVector = [getRandomArbitrary(-10,10), getRandomArbitrary(10,20)];
		var obj = $(cm);
		obj.attr("data-vx", projectileVector[0]);
		obj.attr("data-vy", projectileVector[1]);
		obj.attr("data-px", 0);
		obj.attr("data-py", 0);
	};
	
	this.explode = function(cm) {
		clearInterval(interval);
		init_explode();
		
		var step = 0, rot = 0;
		interval = setInterval(function() { 
			if (step < 0.5) {
				var obj = $(cm),
					vx = parseFloat(obj.attr("data-vx")),
					vy = parseFloat(obj.attr("data-vy")),
					px = parseFloat(obj.attr("data-px")),
					py = parseFloat(obj.attr("data-py"));
				
				vy += -1 * step;
				px += vx * step;
				py -= vy * step;
				
				transform(cm, rot, 0, 0, 0, 0, px, py);
				
				obj.attr({
					"data-vx" : vx,
					"data-vy" : vy,
					"data-px" : px,
					"data-py" : py
				});

				rot += 0.2;
				step += 0.002;
			}
		}, 1);
	};
}