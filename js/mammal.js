var mammal = function(stickerObj, base_scale) {
	
	var interval = -1;
	var svg = stickerObj.contentDocument; 
	var parent = new base(stickerObj, base_scale);

	var body = new component(svg.getElementById("body"), parent.getWidth(), parent.getHeight(), base_scale);
	var head = new component(svg.getElementById("head"), parent.getWidth(), parent.getHeight(), base_scale);
	var rightArm = new component(svg.getElementById("right_arm"), parent.getWidth(), parent.getHeight(), base_scale);
	var leftArm = new component(svg.getElementById("left_arm"), parent.getWidth(), parent.getHeight(), base_scale);
	var rightLeg = new component(svg.getElementById("right_leg"), parent.getWidth(), parent.getHeight(), base_scale);
	var leftLeg = new component(svg.getElementById("left_leg"), parent.getWidth(), parent.getHeight(), base_scale);
	
	var reset = function() {
		clearInterval(interval);
		parent.reset();
	};
	
	var kick = function() {
		var step = 0, rotation_angle = 60, w = parent.getWidth(), h = parent.getHeight();
		interval = setInterval(function() {
			transform(rightLeg.getComponent(), w, h, (Math.sin(step)+1)/2 * -rotation_angle, 1, 0, 0, rightLeg.getJX() - w/2, rightLeg.getJY() - h/2, 0, 0);
			
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
		}, 500);
	};
	
	this.walk = function() {
		
	};
	
	var dance = function() {
		var step = 0, rotation_angle = 40, w = parent.getWidth(), h = parent.getHeight();
		interval = setInterval(function() {
			transform(head.getComponent(), w, h, (Math.cos(step))/2 * -rotation_angle, 1, 0, 0, head.getJX() - w/2, head.getJY() - h/2, 0, 0);
			transform(body.getComponent(), w, h, (Math.sin(step))/2 * -rotation_angle/4, 1, 0, 0, body.getJX() - w/2, body.getJY() - h/2, 0, 0);
			transform(rightArm.getComponent(), w, h, (Math.cos(step))/2 * -rotation_angle-90, 1, 0, 0, rightArm.getJX() - w/2, rightArm.getJY() - h/2, 0, 0);
			transform(leftArm.getComponent(), w, h, (Math.sin(step))/2 * -rotation_angle+90, 1, 0, 0, leftArm.getJX() - w/2, leftArm.getJY() - h/2, 0, 0);
			transform(rightLeg.getComponent(), w, h, (Math.cos(step))/2 * -rotation_angle, 1, 0, 0, rightLeg.getJX() - w/2, rightLeg.getJY() - h/2, 0, 0);
			transform(leftLeg.getComponent(), w, h, (Math.sin(step))/2 * rotation_angle, 1, 0, 0, leftLeg.getJX() - w/2, leftLeg.getJY() - h/2, 0, 0);
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
		}, 1000);
	};
	
	this.animate = function(type) {
		if (parent.animate(type)) {
			return;
		}
		
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
			default:
				alert("Error: Animation '" + type + "' does not exist.");
		} 
	};
}