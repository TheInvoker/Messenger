var mammal = function(svgElement, scope) {
	
	var node = this;
	var interval = -1;
	var innerSvg = svgElement.contentDocument; 
	var parent = new base(svgElement, node, scope);
	var w = parent.getWidth(), h = parent.getHeight();

	// get all the main groups
	var head = new component(innerSvg.getElementById("head_group"), w, h);
	var torso = new component(innerSvg.getElementById("torso_group"), w, h);
	var rightArm = new component(innerSvg.getElementById("right_arm_group"), w, h);
	var leftArm = new component(innerSvg.getElementById("left_arm_group"), w, h);
	var rightLeg = new component(innerSvg.getElementById("right_leg_group"), w, h);
	var leftLeg = new component(innerSvg.getElementById("left_leg_group"), w, h);
	
	var reset = function() {
		parent.reset();
		clearInterval(interval);
	};
	
	
	// MOVING ANIMATIONS  
	
	var walk = function() {
		var step = 0, rotation_angle = 40;
		interval = setInterval(function() {
			rightLeg.transform(-(Math.cos(step)) * 20, 1, 1, 0, 0, 0, 0);
			leftLeg.transform((Math.sin(step)) * 20, 1, 1, 0, 0, 0, 0);
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
		}, 10000);
	};
	
	// ACTION ANIMATIONS  
	
	var kick = function(miniReactionCallback, reversionCallback) {
		var step = 0, rotation_angle = -60;
		interval = setInterval(function() {
			leftLeg.transform((Math.sin(step)+1)/2 * -rotation_angle, 1, 1, 0, 0, 0, 0);
			
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
			miniReactionCallback();
			reversionCallback();
		}, 500);
	};
	
	var slap = function(miniReactionCallback, reversionCallback) {
		var step = 0, rotation_angle = 40;
		interval = setInterval(function() {
			leftArm.transform((Math.sin(step)) * 150, 1, 1, 0, 0, 0, 0);
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
			miniReactionCallback();
			reversionCallback();
		}, 400);
	};
	
	var dance = function(miniReactionCallback, reversionCallback) {
		var step = 0, rotation_angle = 40;
		interval = setInterval(function() {
			head.transform((Math.cos(step))/2 * -rotation_angle, 1, 1, 0, 0, 0, 0);
			torso.transform((Math.sin(step))/2 * -rotation_angle/4, 1, 1, 0, 0, 0, 0);
			rightArm.transform((Math.cos(step))/2 * -rotation_angle-90, 1, 1, 0, 0, 0, 0);
			leftArm.transform((Math.sin(step))/2 * -rotation_angle+90, 1, 1, 0, 0, 0, 0);
			rightLeg.transform((Math.cos(step))/2 * -rotation_angle, 1, 1, 0, 0, 0, 0);
			leftLeg.transform((Math.sin(step))/2 * rotation_angle, 1, 1, 0, 0, 0, 0);
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
			miniReactionCallback();
			reversionCallback();
		}, 2000);
	};
	
	// REACTION ANIMATIONS  
	
	var jump = function() {
		var step = 0;
		interval = setInterval(function() { 
			var scale = 1;
			head.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
			torso.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
			rightArm.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
			leftArm.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
			rightLeg.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
			leftLeg.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
			step += 0.1;
		}, 1);
		
		setTimeout(function() {
			reset();
		}, 200);
	};
	

	
	
	
	
	this.fromYou = function() {
		return parent.fromYou();
	};
	
	this.reset = function() {
		reset();
	};
	
	
	
	this.animateMove = function(type) {
		switch(type) {
			case 'walk':
				walk();
				break;
			default:
				if (!parent.animateMove(type)) {
					alert(sprintf("Error: Move animation '%s' does not exist.", type));
				}
		} 
	};
	
	this.animateAction = function(type, selectedStickerObjectTag, miniReactionCallback) {
		reset();
		
		switch(type) {
			case 'kick':
				parent.moveToOther(selectedStickerObjectTag, function() {
					kick(miniReactionCallback, parent.moveBack);
				});
				break;
			case 'dance':
				parent.moveToOther(selectedStickerObjectTag, function() {
					dance(miniReactionCallback, parent.moveBack);
				});
				break;
			case 'slap':
				parent.moveToOther(selectedStickerObjectTag, function() {
					slap(miniReactionCallback, parent.moveBack);
				});
				break;
			default:
				if (!parent.animateAction(type)) {
					alert(sprintf("Error: Action animation '%s' does not exist.", type));
				}
		} 
	};
	
	this.animateReaction = function(type) {
		reset();
		
		switch(type) {
			case 'jump':
				parent.moveToOther(selectedStickerObjectTag, function() {
					jump();
				});
				break;
			default:
				if (!parent.animateReaction(type)) {
					alert(sprintf("Error: Reaction animation '%s' does not exist.", type));
				}
		} 
	};
}