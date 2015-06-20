var base = function(svgElement, scope) {
	
	var node = this;
	var interval = -1;
	var main_group = svgElement.contentDocument.getElementById("main");
	var w = $(main_group).parent().attr("width").replace("px","");
	var h = $(main_group).parent().attr("height").replace("px","");
	var main_component = new component(main_group, w, h, 0, 0);
	var componentList = getComponents(main_group).map(function(i, x) {
		return new component(x, w, h, w/2, h/2);
	});

	this.reset = function() {
		clearInterval(interval);
		main_component.reset();
		for(var i=0; i<componentList.length; i+=1) {
			componentList[i].reset();
		}
	};
	
	this.getMainComponent = function() {
		return main_component;
	};
	
	this.getWidth = function() {
		return w;
	};
	
	this.getHeight = function() {
		return h;
	};
	
	
	// MOVING ANIMATIONS 
	
	this.moveToOther = function(selectedStickerObjectTag, moveCallback) {
		var myPosition = $(svgElement).position();
		var positionX = myPosition.left;
		var positionY = myPosition.top;
		var myW = $(svgElement).width();
		var myH = $(svgElement).height();
		var targetPosition = $(selectedStickerObjectTag).position();
		var targetX = targetPosition.left;
		var targetY = targetPosition.top;
		
		$(svgElement).animate({
			right: $("#container").width() - myW*0.4 
		}, 1000, moveCallback);
	};
	
	this.moveBack = function() {
		$(svgElement).animate({
			opacity:0
		},500,function() {
			$(svgElement).closest("div.sticker_wrapper").remove();
		});
	};
	
	// ACTION ANIMATIONS  
	
	var piss = function(selectedStickerObjectTag, miniReactionCallback) {
		var position = $(svgElement).position();
		var positionX = position.left + ($(svgElement).width() * 0.5);
		var positionY = position.top + ($(svgElement).height() * 0.7);
		
		var targetPosition = $(selectedStickerObjectTag).position();
		var targetX = targetPosition.left + ($(selectedStickerObjectTag).width() * 0.5);
		var targetY = targetPosition.top + ($(selectedStickerObjectTag).height() * 0.5);
		
		new particleGenerator(scope, positionX, positionY, targetX, targetY, 10, 5, "yellow", 100, 1000, miniReactionCallback);
	};
	
	// REACTION ANIMATIONS  
	
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
			node.reset();
		}, 3000);
		
		var position = $(svgElement).position();
		var positionX = position.left + ($(svgElement).width() * 0.5);
		var positionY = position.top + ($(svgElement).height() * 0.5);
		particleGenerator(scope, positionX, positionY, positionX, positionY - $(svgElement).height()/2, 0, 180, "orange", 0, 200, function() {});
		particleGenerator(scope, positionX, positionY, positionX, positionY - $(svgElement).height()/2, 0, 180, "yellow", 0, 200, function() {});
		particleGenerator(scope, positionX, positionY, positionX, positionY - $(svgElement).height()/2, 0, 180, "red", 0, 200, function() {});
	};
	
	var wobble = function() {
		var step = 0, sinscale = 0.1;
		interval = setInterval(function() { 
			main_component.transform(0, 1+Math.sin(step)*sinscale, 1-Math.sin(step)*sinscale, w/2, h/2, 0, 0);
			step += 0.05;
		}, 1);
		
		setTimeout(function() {
			node.reset();
		}, 2000);
	};	
	
	var twirl = function() {
		var step = 0;
		interval = setInterval(function() { 
			main_component.transform(step, 1, 1, w/2, h/2, 0, 0);
			step += 1;
		}, 1);
		
		setTimeout(function() {
			node.reset();
		}, 1850);
	};
	
	var headBloodBurst = function() {
		var w = $(svgElement).width();
		var h = $(svgElement).height();
		var position = $(svgElement).position();
		var positionX = position.left + ($(svgElement).width() * 0.5);
		var positionY = position.top + ($(svgElement).height() * 0.5);
		particleGenerator(scope, positionX, positionY, positionX, positionY - h/2, 90, 45, "red", 100, 2000, function() {});
	};
	
	
	//ANIMATION HANDLERS
	
	this.animateMove = function(animationType) {
		switch(animationType) {
			case '':
				return true;
		}
		return false;
	};
	
	this.animateAction = function(animationType, moveType, selectedStickerObjectTag, miniReactionCallback) {
		switch(animationType) {
			case 'piss':
				piss(selectedStickerObjectTag, function() {
					miniReactionCallback();
				});
				return true;
		} 
		
		return false;
	};	
	
	this.animateReaction = function(animationType) {
		switch(animationType) {
			case 'explode':
				explode();
				return true;
			case 'wobble':
				wobble();
				return true;
			case 'twirl':
				twirl();
				return true;
			case 'headBurst':
				headBloodBurst();
				return true;
		} 
		
		return false;
	};	
};