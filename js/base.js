/**
	base_scale should be >=0 and <=1
*/
var base = function(stickerObj, base_scale) {
	
	var interval = -1;
	var main_group = stickerObj.contentDocument.getElementById("main")
	var w = parseFloat($(main_group).parent().attr("width"));
	var h = parseFloat($(main_group).parent().attr("height"));
	
	// get the main group
	var main_component = new component(stickerObj, main_group, w, h, base_scale);
	
	var reset = function() {
		clearInterval(interval);
		full_reset_transform(main_component, w, h, base_scale);
	};

	var explode = function() {
		var i, componantsObjs = getComponents(main_group), l=componantsObjs.length;
		for(i=0; i<l; i+=1) {
			var c =  new component(componantsObjs[i], w, h, base_scale);
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
			default:
				return main_component.animate(type);
		} 
		
		return true;
	};	
};