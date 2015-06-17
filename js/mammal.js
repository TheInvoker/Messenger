var mammal = function(svgElement, mappingObj, scope) {
	
	var node = this;
	var interval = -1;
	var innerSvg = svgElement.contentDocument; 
	var parent = new base(svgElement, scope);
	var w = parent.getWidth(), h = parent.getHeight();

	// get the main group
	var main = parent.getMainComponent();
	// get all the main groups
	var head = new component(innerSvg.getElementById("head_group"), w, h, mappingObj.head_group[0], mappingObj.head_group[1]);
	var torso = new component(innerSvg.getElementById("torso_group"), w, h, mappingObj.torso_group[0], mappingObj.torso_group[1]);
	var rightArm = new component(innerSvg.getElementById("right_arm_group"), w, h, mappingObj.right_arm_group[0], mappingObj.right_arm_group[1]);
	var leftArm = new component(innerSvg.getElementById("left_arm_group"), w, h, mappingObj.left_arm_group[0], mappingObj.left_arm_group[1]);
	var rightLeg = new component(innerSvg.getElementById("right_leg_group"), w, h, mappingObj.right_leg_group[0], mappingObj.right_leg_group[1]);
	var leftLeg = new component(innerSvg.getElementById("left_leg_group"), w, h, mappingObj.left_leg_group[0], mappingObj.left_leg_group[1]);
	
	this.reset = function() {
		parent.reset();
		clearInterval(interval);
	};
	
	
	
	
	
	
	// MOVING ANIMATIONS  
	
	var walk = function() {
		var step = 0, rotation_angle = 50, head_angle = 10, torso_angle = 5, arm_angle = 15;
		interval = setInterval(function() {
			main.transform(-(Math.sin(step * 0.8)) * head_angle, 1, 1, w/2, h/2, 0, 0);
			head.transform(-(Math.cos(step * 0.8)) * torso_angle, 1, 1, 0, 0, 0, 0);
			torso.transform(-(Math.cos(step * 0.8)) * torso_angle, 1, 1, 0, 0, 0, 0);
			leftArm.transform((Math.sin(step * 0.8)) * arm_angle, 1, 1, 0, 0, 0, 0);
			rightArm.transform(-(Math.cos(step * 0.8)) * arm_angle, 1, 1, 0, 0, 0, 0);
			rightLeg.transform(-(Math.cos(step)) * rotation_angle, 1, 1, 0, 0, 0, 0);
			leftLeg.transform((Math.sin(step)) * rotation_angle, 1, 1, 0, 0, 0, 0);
			step += 0.1;
		}, 0.5);                             
		setTimeout(function() {
			node.reset();
		}, 5000);
	};
	
	// ACTION ANIMATIONS  
	
	var kick = function(callback) {
		var step = 0, rotation_angle = -80;
		interval = setInterval(function() {
			leftLeg.transform((Math.sin(step)+1)/2 * -rotation_angle, 1, 1, 0, 0, 0, 0);
			main.transform(-(Math.sin(step * 0.8)) * rotation_angle*0.5, 1, 1, w/2, h/2, 0, 0);
			
			step += 0.1;
			if (step > 4.2) {
				node.reset();
				callback();
			}
		}, 1);
	};
	
	var slap = function(callback) {
		var step = 0, rotation_angle = 40;
		interval = setInterval(function() {
			leftArm.transform((Math.sin(step)) * 150, 1, 1, 0, 0, 0, 0);
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			node.reset();
			callback();
		}, 400);
	};
	
	var dance = function(callback) {
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
			node.reset();
			callback();
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
			node.reset();
		}, 200);
	};
	

	//ANIMATION HANDLERS

	this.animateMove = function(animationType) {
		switch(animationType) {
			case 'walk':
				walk();
				break;
			default:
				if (!parent.animateMove(animationType)) {
					alert(sprintf("Error: Move animation '%s' does not exist.", animationType));
				}
		}
	};
	
	this.animateAction = function(animationType, moveType, selectedStickerObjectTag, miniReactionCallback) {
		node.reset();
		node.animateMove(moveType);
		
		switch(animationType) {
			case 'kick':
				parent.moveToOther(selectedStickerObjectTag, function() {
					node.reset();
					kick(function() {
						miniReactionCallback();
						parent.moveBack();
					});
				});
				break;
			case 'dance':
				parent.moveToOther(selectedStickerObjectTag, function() {
					node.reset();
					dance(function() {
						miniReactionCallback();
						parent.moveBack();
					});
				});
				break;
			case 'slap':
				parent.moveToOther(selectedStickerObjectTag, function() {
					node.reset();
					slap(function() {
						miniReactionCallback();
						parent.moveBack();
					});
				});
				break;
			default:
				if (!parent.animateAction(animationType, moveType, selectedStickerObjectTag, miniReactionCallback)) {
					alert(sprintf("Error: Action animation '%s' does not exist.", animationType));
				}
		} 
	};
	
	this.animateReaction = function(animationType) {
		node.reset();
		
		switch(animationType) {
			case 'jump':
				jump();
				break;
			default:
				if (!parent.animateReaction(animationType)) {
					alert(sprintf("Error: Reaction animation '%s' does not exist.", animationType));
				}
		} 
	};
}