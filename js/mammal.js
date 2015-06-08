var mammal = function(svgElement, base_scale) {
	
	var interval = -1;
	var innerSvg = svgElement.contentDocument; 
	var parent = new base(svgElement, base_scale);
	var w = parent.getWidth(), h = parent.getHeight();

	// get all the main groups
	var head = new component(svgElement, innerSvg.getElementById("head_group"), w, h, base_scale);
	var torso = new component(svgElement, innerSvg.getElementById("torso_group"), w, h, base_scale);
	var rightArm = new component(svgElement, innerSvg.getElementById("right_arm_group"), w, h, base_scale);
	var leftArm = new component(svgElement, innerSvg.getElementById("left_arm_group"), w, h, base_scale);
	var rightLeg = new component(svgElement, innerSvg.getElementById("right_leg_group"), w, h, base_scale);
	var leftLeg = new component(svgElement, innerSvg.getElementById("left_leg_group"), w, h, base_scale);
	
	var reset = function() {
		parent.reset();
		clearInterval(interval);
	};
	
	var kick = function() {
		var step = 0, rotation_angle = -60;
		interval = setInterval(function() {
			transform(leftLeg.getComponent(), w, h, (Math.sin(step)+1)/2 * -rotation_angle, 1, 0, 0, leftLeg.getJX() - w/2, leftLeg.getJY() - h/2, 0, 0);
			
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
		}, 500);
	};
	
	var walk = function() {
		
	};
	
	var dance = function() {
		var step = 0, rotation_angle = 40;
		interval = setInterval(function() {
			transform(head.getComponent(), w, h, (Math.cos(step))/2 * -rotation_angle, 1, 0, 0, head.getJX() - w/2, head.getJY() - h/2, 0, 0);
			transform(torso.getComponent(), w, h, (Math.sin(step))/2 * -rotation_angle/4, 1, 0, 0, torso.getJX() - w/2, torso.getJY() - h/2, 0, 0);
			transform(rightArm.getComponent(), w, h, (Math.cos(step))/2 * -rotation_angle-90, 1, 0, 0, rightArm.getJX() - w/2, rightArm.getJY() - h/2, 0, 0);
			transform(leftArm.getComponent(), w, h, (Math.sin(step))/2 * -rotation_angle+90, 1, 0, 0, leftArm.getJX() - w/2, leftArm.getJY() - h/2, 0, 0);
			transform(rightLeg.getComponent(), w, h, (Math.cos(step))/2 * -rotation_angle, 1, 0, 0, rightLeg.getJX() - w/2, rightLeg.getJY() - h/2, 0, 0);
			transform(leftLeg.getComponent(), w, h, (Math.sin(step))/2 * rotation_angle, 1, 0, 0, leftLeg.getJX() - w/2, leftLeg.getJY() - h/2, 0, 0);
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
		}, 2000);
	};
	
	var jump = function() {
		var step = 0;
		interval = setInterval(function(){ 
			transform(head.getComponent(), w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
			transform(torso.getComponent(), w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
			transform(rightArm.getComponent(), w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
			transform(leftArm.getComponent(), w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
			transform(rightLeg.getComponent(), w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
			transform(leftLeg.getComponent(), w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
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
			default:
				if (!parent.animate(type)) {
					alert("Error: Animation '" + type + "' does not exist.");
				}
		} 
	};
}