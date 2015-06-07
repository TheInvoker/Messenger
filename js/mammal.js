var mammal = function(stickerObj, base_scale) {
	
	var interval = -1;
	var svg = stickerObj.contentDocument; 
	var parent = new base(stickerObj, base_scale);
	var w = parent.getWidth(), h = parent.getHeight();

	// get all the main groups
	var torso = new component(stickerObj, svg.getElementById("torso_group"), w, h, base_scale);
	var head = new component(stickerObj, svg.getElementById("head_group"), w, h, base_scale);
	var rightArm = new component(stickerObj, svg.getElementById("right_arm_group"), w, h, base_scale);
	var leftArm = new component(stickerObj, svg.getElementById("left_arm_group"), w, h, base_scale);
	var rightLeg = new component(stickerObj, svg.getElementById("right_leg_group"), w, h, base_scale);
	var leftLeg = new component(stickerObj, svg.getElementById("left_leg_group"), w, h, base_scale);
	
	var reset = function() {
		clearInterval(interval);
	};
	
	var walk = function() {
		
	};
	
	var dance = function() {
		var step = 0, rotation_angle = 40, w = parent.getWidth(), h = parent.getHeight();
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
	
	this.reset = function() {
		reset();
	};
	
	this.animate = function(type) {
		reset();
		parent.reset();
		
		switch(type) {
			case 'kick':
				leftLeg.animate(type);
				break;
			case 'walk':
				walk();
				break;
			case 'dance':
				dance();
				break;
			default:
				if (!parent.animate(type)) {
					alert("Error: Animation '" + type + "' does not exist.");
				}
		} 
	};
}