var sticker = function(obj, base_scale) {
	var interval = -1;
	var svgDoc = obj.contentDocument; 
	var cm = svgDoc.getElementById("mainGroup")
	var w = parseFloat($(cm).parent().attr("width"));
	var h = parseFloat($(cm).parent().attr("height"));
	
	var componants = $(cm).find('path,polygon,polyline').map(function(i, c) {
		return new component(c, w, h, base_scale);
	});
	
	var rightArm = [
		new component(svgDoc.getElementById("right_arm"), w, h, base_scale),
		new component(svgDoc.getElementById("right_wrist"), w, h, base_scale), 
		new component(svgDoc.getElementById("right_slieve"), w, h, base_scale), 
		new component(svgDoc.getElementById("right_hand"), w, h, base_scale)
	];
	var leftArm = [
		new component(svgDoc.getElementById("left_arm"), w, h, base_scale),
		new component(svgDoc.getElementById("left_wrist"), w, h, base_scale), 
		new component(svgDoc.getElementById("left_slieve"), w, h, base_scale), 
		new component(svgDoc.getElementById("left_hand"), w, h, base_scale)
	];
	var rightLeg = [
		new component(svgDoc.getElementById("right_thigh"), w, h, base_scale),
		new component(svgDoc.getElementById("right_limb"), w, h, base_scale), 
		new component(svgDoc.getElementById("right_foot"), w, h, base_scale)
	];
	var leftLeg = [
		new component(svgDoc.getElementById("left_thigh"), w, h, base_scale),
		new component(svgDoc.getElementById("left_limb"), w, h, base_scale), 
		new component(svgDoc.getElementById("left_foot"), w, h, base_scale)
	];
	var body = [
		new component(svgDoc.getElementById("body"), w, h, base_scale)
	];
	var neck = [
		new component(svgDoc.getElementById("neck"), w, h, base_scale)
	];
	var head = [
		new component(svgDoc.getElementById("left_ear"), w, h, base_scale),
		new component(svgDoc.getElementById("right_ear"), w, h, base_scale),
		new component(svgDoc.getElementById("face"), w, h, base_scale),
		new component(svgDoc.getElementById("left_eye"), w, h, base_scale),
		new component(svgDoc.getElementById("right_eye"), w, h, base_scale),
		new component(svgDoc.getElementById("mouth"), w, h, base_scale),
		new component(svgDoc.getElementById("hair"), w, h, base_scale)
	];

	
	this.wobble = function() {
		clearInterval(interval);
		
		var step = 0;
		var sinscale = 0.1;
		interval = setInterval(function(){ 
			transform(cm, w, h, 0, base_scale, Math.sin(step)*sinscale, -Math.sin(step)*sinscale, 0, 0, 0, 0);
			step += 0.05;
		}, 1);
	};
	
	this.jump = function() {
		clearInterval(interval);
		
		var step = 0;
		interval = setInterval(function(){ 
			transform(cm, w, h, 0, base_scale, 0, 0, 0, 0, 0, 10*(Math.sin(step)+1));
			step += 0.1;
		}, 1);
	};
	
	this.twirl = function() {
		clearInterval(interval);
		
		var step = 0;
		interval = setInterval(function() { 
			transform(cm, w, h, step, base_scale, 0, 0, 0, 0, 0, 0);
			step += 1;
		}, 1);
	};
	
	this.explode = function() {
		var i, l=componants.length;
		for(i=0; i<l; i+=1) {
			var c = componants[i];
			c.fly();
		}
	};
	
	this.kick = function() {
		clearInterval(interval);
		
		var step = 0;
		interval = setInterval(function() {
			transform(cm, w, h, 0, base_scale, 0, 0, 0, 0, 0, 0);
		
			var i, l=rightLeg.length;
			for(i=0; i<l; i+=1) {
				var c = rightLeg[i];
				transform(c.getComponent(), w, h, (Math.sin(step)+1)/2 * -60, 1, 0, 0, 220 - w/2, 280 - h/2, 0, 0);
			}
			step += 0.1;
			
			if (step > Math.PI*1.5) {
				clearInterval(interval);
			}
		}, 10);
	};
	
	this.walk = function() {
		clearInterval(interval);
		
		var step = 0;
		interval = setInterval(function() {
			transform(cm, w, h, 0, base_scale, 0, 0, 0, 0, 0, 0);
		
			var i, l=rightLeg.length;
			for(i=0; i<l; i+=1) {
				var c = rightLeg[i];
				transform(c.getComponent(), w, h, (Math.cos(step))/2 * -40, 1, 0, 0, 220 - w/2, 280 - h/2, 0, 0);
			}
			var i, l=leftLeg.length;
			for(i=0; i<l; i+=1) {
				var c = leftLeg[i];
				transform(c.getComponent(), w, h, (Math.sin(step))/2 * 40, 1, 0, 0, 179 - w/2, 280 - h/2, 0, 0);
			}
			step += 0.1;
		}, 10);
	};
};