var mammal = function(svgElement, scope) {
	
	var node = this;
	var interval = -1;
	var innerSvg = svgElement.contentDocument; 
	var parent = new base(svgElement, scope);
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
	
	var kick = function() {
		var step = 0, rotation_angle = -60;
		interval = setInterval(function() {
			leftLeg.transform((Math.sin(step)+1)/2 * -rotation_angle, 1, 1, 0, 0, 0, 0);
			
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
		}, 500);
	};
	
	var walk = function() {
		parent.moveToOther(function() {
			node.animate('slap');
		});

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
	
	var slap = function() {
		var step = 0, rotation_angle = 40;
		interval = setInterval(function() {
			leftArm.transform((Math.sin(step)) * 150, 1, 1, 0, 0, 0, 0);
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
			parent.moveBack();
		}, 400);
	};
	
	var dance = function() {
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
		}, 2000);
	};
	
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
	

	
	this.reset = function() {
		reset();
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
			case 'dance':
				dance();
				break;
			case 'jump':
				jump();
				break;
			case 'slap':
				slap();
				break;
			default:
				if (!parent.animate(type)) {
					alert("Error: Animation '" + type + "' does not exist.");
				}
		} 
	};
}