var base = function(svgElement, scope) {
	
	var node = this;
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
		return $(svgElement).parent().parent().prev(".message:has(object)").eq(0).find('object');
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
				cm.setAttr("speed-x", vx);
				cm.setAttr("data-px", px);
				cm.setAttr("data-py", py);
			}
			rot += 0.2;
			step += 0.002;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 3000);
		
		var position = $(svgElement).position();
		var positionX = position.left + (w * 0.5);
		var positionY = position.top + (h * 0.5);
		particleGenerator(scope, positionX, positionY, positionX, positionY - h/2, 0, 180, "orange", 0, 200);
		particleGenerator(scope, positionX, positionY, positionX, positionY - h/2, 0, 180, "yellow", 0, 200);
		particleGenerator(scope, positionX, positionY, positionX, positionY - h/2, 0, 180, "red", 0, 200);
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
			
			var w_other = $(prevObj).width();
			var h_other = $(prevObj).height();
			var targetPosition = $(prevObj).position();
			var targetX = targetPosition.left + (w_other * 0.5);
			var targetY = targetPosition.top + (h_other * 0.5);
			
			new particleGenerator(scope, positionX, positionY, targetX, targetY, 10, 5, "yellow", 100, 1000);
		}
	};
	
	var headBloodBurst = function() {
		var w = $(svgElement).width();
		var h = $(svgElement).height();
		var position = $(svgElement).position();
		var positionX = position.left + (w * 0.5);
		var positionY = position.top + (h * 0.5);
		particleGenerator(scope, positionX, positionY, positionX, positionY - h/2, 90, 45, "red", 100, 2000);
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