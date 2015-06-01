var sticker = function(obj, base_scale) {
	
	var interval = -1;
	var svgDoc = obj.contentDocument; 
	var cm = svgDoc.getElementById("main")
	var w = parseFloat($(cm).parent().attr("width"));
	var h = parseFloat($(cm).parent().attr("height"));
	
	var body = new component(svgDoc.getElementById("body"), w, h, base_scale);
	var head = new component(svgDoc.getElementById("head"), w, h, base_scale);
	var rightArm = new component(svgDoc.getElementById("right_arm"), w, h, base_scale);
	var leftArm = new component(svgDoc.getElementById("left_arm"), w, h, base_scale);
	var rightLeg = new component(svgDoc.getElementById("right_leg"), w, h, base_scale);
	var leftLeg = new component(svgDoc.getElementById("left_leg"), w, h, base_scale);
	
	var componants = $(cm).find('path,polygon,polyline').map(function(i, c) {
		return new component(c, w, h, base_scale);
	});
	
	var reset = function() {
		transform(cm, w, h, 0, base_scale, 0, 0, 0, 0, 0, 0);
		
		$(cm).find('g').each(function(i, x) {
			transform(x, w, h, 0, 1, 0, 0, 0, 0, 0, 0);
		});

		var i, l=componants.length;
		for(i=0; i<l; i+=1) {
			transform(componants[i].getComponent(), w, h, 0, 1, 0, 0, 0, 0, 0, 0);
		}
	};

	this.wobble = function() {
		var step = 0;
		var sinscale = 0.1;
		interval = setInterval(function(){ 
			transform(cm, w, h, 0, base_scale, Math.sin(step)*sinscale, -Math.sin(step)*sinscale, 0, 0, 0, 0);
			step += 0.05;
		}, 1);
		
		setTimeout(function() {
			reset();
			clearInterval(interval);
		}, 1000);
	};
	
	this.jump = function() {
		var step = 0;
		interval = setInterval(function(){ 
			transform(cm, w, h, 0, base_scale, 0, 0, 0, 0, 0, -10*(Math.sin(step)+1));
			step += 0.1;
		}, 1);
		
		setTimeout(function() {
			reset();
			clearInterval(interval);
		}, 200);
	};
	
	this.twirl = function() {
		var step = 0;
		interval = setInterval(function() { 
			transform(cm, w, h, step, base_scale, 0, 0, 0, 0, 0, 0);
			step += 1;
		}, 1);
		
		setTimeout(function() {
			reset();
			clearInterval(interval);
		}, 1850);
	};
	
	this.explode = function() {
		var i, l=componants.length;
		for(i=0; i<l; i+=1) {
			var c = componants[i];
			c.fly();
		}
		
		setTimeout(function() {
			reset();
		}, 1000);
	};
	
	this.kick = function() {
		var step = 0, rotation_angle = 60;
		interval = setInterval(function() {
			transform(cm, w, h, 0, base_scale, 0, 0, 0, 0, 0, 0);
			transform(rightLeg.getComponent(), w, h, (Math.sin(step)+1)/2 * -rotation_angle, 1, 0, 0, rightLeg.getJX() - w/2, rightLeg.getJY() - h/2, 0, 0);
			
			step += 0.1;
		}, 10);
		
		setTimeout(function() {
			reset();
			clearInterval(interval);
		}, 500);
	};
	
	this.dance = function() {
		var step = 0, rotation_angle = 40;
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
			clearInterval(interval);
		}, 1000);
	};
	
	reset();
};