/**
	base_scale should be >=0 and <=1
*/
var base = function(stickerObj, base_scale) {
	
	var interval = -1;
	var svg = stickerObj.contentDocument;
	var main_group = svg.getElementById("main")
	var w = parseFloat($(main_group).parent().attr("width"));
	var h = parseFloat($(main_group).parent().attr("height"));
	var components = $(main_group).find('path,polygon,polyline');
	var componantsObjs = components.map(function(i, c) {
		return new component(c, w, h, base_scale);
	});
	
	var reset = function() {
		clearInterval(interval);
		$.merge($(main_group).parent().find('g'), components).each(function(i, x) {
			transform(x, w, h, 0, 1, 0, 0, 0, 0, 0, 0);
		});
	};
	
	var wobble = function() {
		var step = 0, sinscale = 0.1;
		interval = setInterval(function(){ 
			transform(main_group, w, h, 0, base_scale, Math.sin(step)*sinscale, -Math.sin(step)*sinscale, 0, 0, 0, 0);
			step += 0.05;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 1000);
	};
	
	var jump = function() {
		var step = 0;
		interval = setInterval(function(){ 
			transform(main_group, w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
			step += 0.1;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 200);
	};
	
	var twirl = function() {
		var step = 0;
		interval = setInterval(function() { 
			transform(main_group, w, h, step, base_scale, 0, 0, 0, 0, 0, 0);
			step += 1;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 1850);
	};
	
	var explode = function() {
		var i, l=componantsObjs.length;
		for(i=0; i<l; i+=1) {
			var c = componantsObjs[i];
			c.animate('fly');
		}
		
		setTimeout(function() {
			reset();
		}, 1000);
	};
	
	var piss = function() {
		var prevObj = $(stickerObj).parent().prevAll("div.from-them:last").find("object");
		if (prevObj.length == 1) {
			var position = $(stickerObj).offset();
			var positionX = position.left + ($(stickerObj).width() * 0.53);
			var positionY = position.top + ($(stickerObj).height() * 0.8);
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

	
	
	
	
	
	

	this.getWidth = function() {
		return w;
	};
	
	this.getHeight = function() {
		return h;
	};
	
	this.reset = function() {
		reset();
	};
	
	this.animate = function(type) {
		reset();
		
		switch(type) {
			case 'wobble':
				wobble();
				break;
			case 'jump':
				jump();
				break;
			case 'twirl':
				twirl();
				break;	
			case 'explode':
				explode();
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