var base = function(svg, base_scale) {
	
	var interval = -1;
	var main_group = svg.getElementById("main")
	var w = parseFloat($(main_group).parent().attr("width"));
	var h = parseFloat($(main_group).parent().attr("height"));
	
	var components = $(main_group).find('path,polygon,polyline');
	var componantsObjs = components.map(function(i, c) {
		return new component(c, w, h, base_scale);
	});
	
	var reset = function() {
		clearInterval(interval);
		$.merge($(main_group).find('g'), components.add(main_group)).each(function(i, x) {
			transform(x, w, h, 0, 1, 0, 0, 0, 0, 0, 0);
		});
	};

	this.getWidth = function() {
		return w;
	};
	this.getHeight = function() {
		return h;
	};
	
	
	this.wobble = function() {
		reset();
		
		var step = 0, sinscale = 0.1;
		interval = setInterval(function(){ 
			transform(main_group, w, h, 0, base_scale, Math.sin(step)*sinscale, -Math.sin(step)*sinscale, 0, 0, 0, 0);
			step += 0.05;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 1000);
	};
	
	
	this.jump = function() {
		reset();
		
		var step = 0;
		interval = setInterval(function(){ 
			transform(main_group, w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
			step += 0.1;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 200);
	};
	
	this.twirl = function() {
		reset();
		
		var step = 0;
		interval = setInterval(function() { 
			transform(main_group, w, h, step, base_scale, 0, 0, 0, 0, 0, 0);
			step += 1;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 1850);
	};
	
	this.explode = function() {
		reset();
		
		var i, l=componantsObjs.length;
		for(i=0; i<l; i+=1) {
			var c = componantsObjs[i];
			c.fly();
		}
		
		setTimeout(function() {
			reset();
		}, 1000);
	};
	
	this.kick = function() {
		reset();
		
		transform(cm, w, h, 0, base_scale, 0, 0, 0, 0, 0, 0);
		
		var step = 0, rotation_angle = 60;
		interval = setInterval(function() {
			transform(rightLeg.getComponent(), w, h, (Math.sin(step)+1)/2 * -rotation_angle, 1, 0, 0, rightLeg.getJX() - w/2, rightLeg.getJY() - h/2, 0, 0);
			
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
		}, 500);
	};
	
	this.dance = function() {
		reset();
		
		var step = 0, rotation_angle = 40;
		interval = setInterval(function() {
			transform(head.getComponent(), w, h, (Math.cos(step))/2 * -rotation_angle, 1, 0, 0, head.getJX() - w/2, head.getJY() - h/2, 0, 0);
			transform(body.getComponent(), w, h, (Math.sin(step))/2 * -rotation_angle/4, 1, 0, 0, body.getJX() - w/2, body.getJY() - h/2, 0, 0);
			transform(rightArm.getComponent(), w, h, (Math.cos(step))/2 * -rotation_angle-90, 1, 0, 0, rightArm.getJX() - w/2, rightArm.getJY() - h/2, 0, 0);
			transform(leftArm.getComponent(), w, h, (Math.sin(step))/2 * -rotation_angle+90, 1, 0, 0, leftArm.getJX() - w/2, leftArm.getJY() - h/2, 0, 0);
			transform(rightLeg.getComponent(), w, h, (Math.cos(step))/2 * -rotation_angle, 1, 0, 0, rightLeg.getJX() - w/2, rightLeg.getJY() - h/2, 0, 0);
			transform(leftLeg.getComponent(), w, h, (Math.sin(step))/2 * rotation_angle, 1, 0, 0, leftLeg.getJX() - w/2, leftLeg.getJY() - h/2, 0, 0);
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
		}, 1000);
	};
	
	this.piss = function() {
		var prevObj = $(obj).parent().prevAll("div.from-them:last").find("object");
		if (prevObj.length == 1) {
			var position = $(obj).offset();
			var positionX = position.left + ($(obj).width() * 0.53);
			var positionY = position.top + ($(obj).height() * 0.8);
			var targetPosition = $(prevObj).offset();


			

			
			
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
};