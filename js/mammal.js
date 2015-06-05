var mammal = function(stickerObj, base_scale) {
	
	var svg = stickerObj.contentDocument; 
	var parent = new base(svg, base_scale);

	
	//var body = new component(svg.getElementById("body"), parent.getWidth(), parent.getHeight(), base_scale);
	//var head = new component(svg.getElementById("head"), parent.getWidth(), parent.getHeight(), base_scale);
	//var rightArm = new component(svg.getElementById("right_arm"), parent.getWidth(), parent.getHeight(), base_scale);
	//var leftArm = new component(svg.getElementById("left_arm"), parent.getWidth(), parent.getHeight(), base_scale);
	//var rightLeg = new component(svg.getElementById("right_leg"), parent.getWidth(), parent.getHeight(), base_scale);
	//var leftLeg = new component(svg.getElementById("left_leg"), parent.getWidth(), parent.getHeight(), base_scale);
	
	this.animate = function(type) {
		switch(type) {
			case 'wobble':
				parent.wobble();
				break;
			case 'jump':
				parent.jump();
				break;
			case 'twirl':
				parent.twirl();
				break;	
			case 'explode':
				parent.explode();
				break;
			case 'kick':
				parent.kick();
				break;
			case 'dance':
				parent.dance();
				break;
			case 'piss':
				parent.piss();
				break;
			default:
				alert("Error: Animation does not exist.");
		} 
	};
}