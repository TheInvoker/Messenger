var component = function(stickerObj, cm, w, h, base_scale) {
	
	var interval = -1;
	var jx = parseInt(cm.getAttribute("data-jointx"), 10);
	var jy = parseInt(cm.getAttribute("data-jointy"), 10);
	
	var reset = function() {
		clearInterval(interval);
	};
	
	var init_fly = function() {
		var obj = $(cm);
		obj.attr("speed_x", getRandomArbitrary(-2,2));
		obj.attr("speed_y", getRandomArbitrary(2,4));
		obj.attr("data-px", 0);
		obj.attr("data-py", 0);
	};
	
	var fly = function() {
		init_fly();
		
		var step = 0, rot = 0;
		interval = setInterval(function() { 
			var obj = $(cm),
				vx = parseFloat(obj.attr("speed_x")),
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
	
	var jump = function() {
		var step = 0;
		interval = setInterval(function(){ 
			transform(cm, w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
			step += 0.1;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 200);
	};
	
	var twirl = function() {
		var step = 0;
		interval = setInterval(function() { 
			transform(cm, w, h, step, base_scale, 0, 0, 0, 0, 0, 0);
			step += 1;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 1850);
	};
	
	var kick = function() {
		var step = 0, rotation_angle = -60;
		interval = setInterval(function() {
			transform(cm, w, h, (Math.sin(step)+1)/2 * -rotation_angle, 1, 0, 0, jx - w/2, jy - h/2, 0, 0);
			
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
		}, 500);
	};
	
	var walk = function() {
		
	};
	
	var piss = function() {
		var prevObj = $(stickerObj).parent().prev(".message:has(object)").eq(0).find('object');
		
		
		if (prevObj.length == 1) {
			var position = $(stickerObj).position();
			var positionX = position.left + ($(stickerObj).width() * 0.53);
			var positionY = position.top + ($(stickerObj).height() * 0.8);
			var targetPosition = $(prevObj).position();


		
			var len = 100;
			var particleList = [];
			var EE = setInterval(function() {
				var variance = 0;
				var targetX = targetPosition.left + ($(prevObj).width() * (0.53 + variance*Math.random() - variance/2));
				var targetY = targetPosition.top + ($(prevObj).height() * (0.8 + variance*Math.random() - variance/2));
				
				var particle = $("<div class='particle yellow' data-step='0' data-targetx='" + targetX + "' data-targety='" + targetY + "'/>").css({
					position: 'absolute',
					left: positionX + 'px',
					top: positionY + 'px',
				});
				particleList.push(particle);
				$("body").append(particle);
				
				len -= 1;
				if (len == 0) {
					clearInterval(EE);
				}
			}, 10);
			
			
			interval = setInterval(function() {
				var len = particleList.length;
				for(var i=len-1; i>=0; i-=1) {
					var particle = particleList[i];
					var step = parseInt($(particle).attr("data-step"), 10);
					var targetX = parseFloat($(particle).attr("data-targetx"));
					var targetY = parseFloat($(particle).attr("data-targety"));
					var xDist = positionX-targetX;
					var yDist = positionY-targetY;
					
					var y = (yDist/xDist)*step;
					particle.css({
						left: positionX - step,
						top: positionY - y - Math.sin((step/xDist) * Math.PI)*100
					});
					
					step += 1;
					$(particle).attr("data-step", step);
					
					if (step > xDist) {
						particle.remove();
						particleList.splice(i, 1);
						if (particleList.length == 0) {
							clearInterval(interval);
						}
					}
				}
			}, 5);
		}
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
			case 'kick':
				kick();
				break;
			case 'walk':
				walk();
				break;
			case 'jump':
				jump();
				break;
			case 'twirl':
				twirl();
				break;	
			case 'fly':
				fly();
				break;
			case 'piss':
				piss();
				break;
			default:
				return false;
		} 
		
		return true;
	};
};