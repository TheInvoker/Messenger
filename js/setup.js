$(document).ready(function() {
	
	var pressTimer;
	var animationObj = new animation(function(div) {
		$("#ani-container").append(div);
	}, function() {
		$("#ani-container").animate({ scrollTop: $("#ani-container")[0].scrollHeight}, 'fast');
	}, function(str) {
		$("#ani-picker").html(str);
	});

	// open sticker drawer
	$("#sticker-button").click(function() {
		$("#ani-picker").toggle();
		$("#ani-reaction-picker").hide();
	});
	
	// when click on a regular sticker from the drawer
	$("#ani-picker").on('click', 'img.ani-sticker_select', function() {
		animationObj.addSticker(true, this);
		$("#ani-picker").hide();
	});
	
	// when click on a reaction sticker from the drawer
	$("#ani-reaction-picker").on('click', 'img.ani-reaction_select', function() {
		animationObj.addReactionSticker(true, this);
		$("#ani-reaction-picker").hide();
	});
	
	// handle closing of popup via swipe
	$("#ani-picker, #ani-reaction-picker").swipe({
		swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
			if (direction=="left" || direction=="right") {
				$(this).toggle();
			}
		},
		threshold:75
	});
	
	// handle the hold event on the sticker from the other person
	$("#ani-container").on('mousedown touchstart', 'div.ani-from-them div.ani-sticker_wrapper', function() { 
		var imgTag = this;
		pressTimer = window.setTimeout(function() { 
			animationObj.reactionStickerHolder(imgTag, function(str) {
				$("#ani-picker").hide();
				$("#ani-reaction-picker").html(str).show();
			});
		},600);
		return false; 
	}).on('mouseup touchend', 'div.ani-from-them div.ani-sticker_wrapper', function() { 
		clearTimeout(pressTimer);
		return false;
	});
	
	// animation box event
	// COMMENTED THIS OUT BECAUSE IT STOPS THE CLICK EVENT FROM WORKING ON MOBILE
	/*
	$("#ani-reaction-picker").on('mousedown touchstart', 'img', function() { 
		var imgTag = this;
		pressTimer = window.setTimeout(function() { 
			$("#ani-overlay, #ani-animation-preview").fadeIn();
		},600);
		return false; 
	}).on('mouseup touchend', 'img', function() { 
		clearTimeout(pressTimer);
		return false;
	});
	$("#ani-overlay").click(function() {
		$("#ani-overlay, #ani-animation-preview").fadeOut();
	});
	*/
});