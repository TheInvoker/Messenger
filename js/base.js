var base = function(svgElement) {
	
	var interval = -1;
	var main_group = svgElement.contentDocument.getElementById("main");
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
	
	var genParticle = function(width, height, positionX, positionY, targetX, targetY, variance, color, duration) {
		var particleList = [];
		
		var EE = setInterval(function() {
			targetX += (variance * ((Math.random()*2)-1));
			targetY += (variance * ((Math.random()*2)-1));
			var dist = Math.sqrt(Math.pow(targetX-positionX, 2) + Math.pow(targetY-positionY, 2));
			var degree = Math.atan2(targetY - positionY, targetX - positionX) * 180 / Math.PI;
			
			var tag = sprintf("<div class='particle' style='background-color:%s;' data-step='0' data-dist='%f' data-angle='%f'/>",color,dist,degree);
			var particle = $(tag).css({
				position: 'absolute',
				left: positionX + 'px',
				top: positionY + 'px',
			});
			particleList.push(particle);
			$("body").append(particle);
		}, 10);
		setTimeout(function() {
			clearInterval(EE);
		}, duration);
	
		interval = setInterval(function() {
			var len = particleList.length;
			for(var i=len-1; i>=0; i-=1) {
				var particle = particleList[i];
				var step = parseInt($(particle).attr("data-step"), 10);
				var dist = parseFloat($(particle).attr("data-dist"));
				var angle = parseFloat($(particle).attr("data-angle"));
				
				
				var data = length_dir(step, angle);
				var x_rel = data[0];
				var y_rel = data[1];
				if (x_rel != 0) {
					var travelleddist = Math.sqrt(Math.pow(x_rel, 2) + Math.pow(y_rel, 2));
					y_rel -= Math.sin((travelleddist/dist) * Math.PI)*100;
				}
				
				particle.css({
					left: positionX + x_rel,
					top: positionY + y_rel
				});
				
				step += 1;
				$(particle).attr("data-step", step);
				
				var travelledDist = Math.sqrt(Math.pow(positionX-(positionX - x_rel), 2) + Math.pow(positionY-(positionY - y_rel), 2));
				if (travelledDist >= dist) {
					particle.remove();
					particleList.splice(i, 1);
					if (particleList.length == 0) {
						clearInterval(interval);
					}
				}
			}
		}, 5);
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
			var w = $(svgElement).width();
			var h = $(svgElement).height();
			var position = $(svgElement).position();
			var positionX = position.left + (w * 0.5);
			var positionY = position.top + (h * 0.7);
			var targetPosition = $(prevObj).position();
			var targetX = targetPosition.left + ($(prevObj).width() * 0.5);
			var targetY = targetPosition.top + ($(prevObj).height() * 0.5);
			
			genParticle(w, h, positionX, positionY, targetX, targetY, 10, "yellow", 1000);
		}
	};
	
	var headBloodBurst = function() {
		var w = $(svgElement).width();
		var h = $(svgElement).height();
		var position = $(svgElement).position();
		var positionX = position.left + (w * 0.5);
		var positionY = position.top + (h * 0.5);
		genParticle(w, h, positionX, positionY, positionX, positionY - h/2, 25, "red", 2000);
	};
	
	
	
	
	
	this.genParticle = function(width, height, positionX, positionY, targetX, targetY, variance, color, duration) {
		genParticle(width, height, positionX, positionY, targetX, targetY, variance, color, duration);
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
						left: targetX-positionX+myW*0.3
					}, 1000, func);
				});
			});
		}
	};
	
	this.moveBack = function(func) {
		$(svgElement).animate({
			opacity:0
		},500,function() {
			$(svgElement).css({
				top:0,
				left:0
			}).animate({
				opacity:1
			},500);
		});
	}
	
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
			case 'headBurst':
				headBloodBurst();
				break;
			default:
				return main_component.animate(type);
		} 
		
		return true;
	};	
};