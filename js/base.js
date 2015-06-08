/**
	base_scale should be >=0 and <=1
*/
var base = function(svgElement, base_scale) {
	
	var interval = -1;
	var main_group = svgElement.contentDocument.getElementById("main")
	var w = parseFloat($(main_group).parent().attr("width"));
	var h = parseFloat($(main_group).parent().attr("height"));
	
	// get the main group
	var main_component = new component(svgElement, main_group, w, h, base_scale);

	var reset = function() {
		clearInterval(interval);
		full_reset_transform(main_component, w, h, base_scale);
	};
	
	var explode = function() {
		var i, componantsObjs = getComponents(main_group), l=componantsObjs.length;
		for(i=0; i<l; i+=1) {
			var c =  new component(svgElement, componantsObjs[i], w, h, base_scale);
			c.animate('fly');
		}
		
		setTimeout(function() {
			reset();
		}, 1000);
	};
	
	var wobble = function() {
		var step = 0, sinscale = 0.1;
		interval = setInterval(function(){ 
			transform(main_component.getComponent(), w, h, 0, base_scale, Math.sin(step)*sinscale, -Math.sin(step)*sinscale, 0, 0, 0, 0);
			step += 0.05;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 2000);
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
	
	var piss = function() {
		var prevObj = $(svgElement).parent().prev(".message:has(object)").eq(0).find('object');
		
		
		if (prevObj.length == 1) {
			var position = $(svgElement).position();
			var positionX = position.left + ($(svgElement).width() * 0.53);
			var positionY = position.top + ($(svgElement).height() * 0.8);
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