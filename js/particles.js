var particleGenerator = function(scope, positionX, positionY, targetX, targetY, dist_variance, angle_variance, color, curve, duration, miniReactionCallback) {
	
	var particleList = [];
	
	var EE = setInterval(function() {
		var dist = Math.sqrt(Math.pow(targetX-positionX, 2) + Math.pow(targetY-positionY, 2));
		var degree = Math.atan2(targetY - positionY, targetX - positionX) * 180 / Math.PI;
		dist += dist_variance * ((Math.random()*2)-1);
		degree += angle_variance * ((Math.random()*2)-1);
		
		var tag = sprintf("<div class='particle' style='background-color:%s;' />",color);
		var particle = $(tag).css({
			position: 'absolute',
			left: positionX + 'px',
			top: positionY + 'px',
		});
		particleList.push({
			obj : particle,
			step : 0,
			dist : dist,
			angle : degree
		});
		$(scope).append(particle);
	}, 10);
	setTimeout(function() {
		clearInterval(EE);
	}, duration);

	var interval = setInterval(function() {
		var len = particleList.length;
		for(var i=len-1; i>=0; i-=1) {
			var obj = particleList[i];
			
			var particle = obj.obj,
			    step = obj.step,
				dist = obj.dist,
				angle = obj.angle;			
			
			var data = length_dir(step, angle);
			var x_rel = data[0];
			var y_rel = data[1];
			y_rel -= Math.sin((step/dist) * Math.PI)*curve;
			
			particle.css({
				left: positionX + x_rel,
				top: positionY + y_rel
			});
			
			step += 1;
			obj.step = step;
			
			if (step >= dist) {
				particle.remove();
				particleList.splice(i, 1);
				if (particleList.length == 0) {
					clearInterval(interval);
					miniReactionCallback();
				}
			}
		}
	}, 5);
};