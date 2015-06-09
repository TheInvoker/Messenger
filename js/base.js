var base = function(svgElement) {
	
	var interval = -1;
	var main_group = svgElement.contentDocument.getElementById("main")
	var w = parseFloat($(main_group).parent().attr("width"));
	var h = parseFloat($(main_group).parent().attr("height"));
	var main_component = new component(main_group, w, h);
	var componentList = getComponents(main_group).map(function(i, x) {
		return new component(x, w, h);
	});
	
	var reset = function() {
		clearInterval(interval);
		main_component.reset();
		var i, l=componentList.length;
		for(i=0; i<l; i+=1) {
			componentList[i].reset();
		}
	};
	
	var getPreviousSVG = function() {
		return $(svgElement).parent().prev(".message:has(object)").eq(0).find('object');
	};
	
	var explode = function() {	
		var i, l = componentList.length, step = 0, rot = 0;
		for(i=0; i<l; i+=1) {
			componentList[i].initMove();
		}
		
		interval = setInterval(function() { 
			for(i=0; i<l; i+=1) {	
				var cm = componentList[i];
			
				var vx = cm.getAttr("speed-x"),
					vy = cm.getAttr("speed-y"),
					px = cm.getAttr("data-px"),
					py = cm.getAttr("data-py");
					
				px += vx;
				py -= vy;
				vy -= 0.1;
				
				cm.transform(rot, 1, 1, w/2, h/2, px, py);
				
				cm.setAttr("speed-y", vy);
				cm.setAttr("data-px", px);
				cm.setAttr("data-py", py);
			}
			rot += 0.2;
			step += 0.002;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 1000);
	};
	
	var wobble = function() {
		var step = 0, sinscale = 0.1;
		interval = setInterval(function() { 
			main_component.transform(0, 1+Math.sin(step)*sinscale, 1-Math.sin(step)*sinscale, 0, 0, 0, 0);
			step += 0.05;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 2000);
	};	
	
	var twirl = function() {
		var step = 0;
		interval = setInterval(function() { 
			main_component.transform(step, 1, 1, w/2, h/2, 0, 0);
			step += 1;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 1850);
	};
	
	var piss = function() {
		var prevObj = getPreviousSVG();
		
		if (prevObj.length == 1) {	
			var position = $(svgElement).position();
			var positionX = position.left + ($(svgElement).width() * 0.5);
			var positionY = position.top + ($(svgElement).height() * 0.7);
			var targetPosition = $(prevObj).position();

			var particleList = [];
			var EE = setInterval(function() {
				var variance = 0.9;
				var targetX = targetPosition.left + ($(prevObj).width() * (0.5 + variance*Math.random() - variance/2));
				var targetY = targetPosition.top + ($(prevObj).height() * (0.5 + variance*Math.random() - variance/2));
				
				var particle = $("<div class='particle yellow' data-step='0' data-targetx='" + targetX + "' data-targety='" + targetY + "'/>").css({
					position: 'absolute',
					left: positionX + 'px',
					top: positionY + 'px',
				});
				particleList.push(particle);
				$("body").append(particle);
				
				len -= 1;
			}, 10);
			setTimeout(function() {
				clearInterval(EE);
			}, 1000);
			
			
			
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

	
	
	this.moveToOther = function(func) {
		var prevObj = getPreviousSVG();
		
		if (prevObj.length == 1) {	
			var position = $(svgElement).position();
			var positionX = position.left;
			var positionY = position.top;
			var myW = $(svgElement).width();
			var myH = $(svgElement).height();
			var targetPosition = $(prevObj).position();
			var targetX = targetPosition.left;
			var targetY = targetPosition.top;
			
			$(svgElement).animate({
				left: myW
			}, 500, function() {
				$(svgElement).animate({
					top: -myH
				}, 500, function() {
					$(svgElement).animate({
						top: targetY-positionY,
						left: targetX-positionX
					}, 1000, func);
				});
			});
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
		switch(type) {
			case 'explode':
				explode();
				break;
			case 'wobble':
				wobble();
				break;
			case 'twirl':
				twirl();
				break;	
			case 'piss':
				piss();
				break;
			default:
				return main_component.animate(type);
		} 
		
		return true;
	};	
};