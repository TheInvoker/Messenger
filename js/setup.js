$(document).ready(function() {
	
	var pressTimer;
	var animationObj = new animation(function() {
		return $("#ani-container");
	}, function(str) {
		$("#ani-picker").html(str);
	}, function(str) {
		$("#ani-reaction-picker").html(str).show();
	});

	// open sticker drawer
	$("#ani-sticker-button").click(function() {
		$("#ani-picker").toggle();
		$("#ani-reaction-picker").hide();
	});
	
	// when click on a regular sticker from the drawer
	$("#ani-picker").on('click', 'img.ani-sticker-select', function() {
		animationObj.addSticker(true, this);
		$("#ani-picker").hide();
	});
	
	// when click on a reaction sticker from the drawer
	$("#ani-reaction-picker").on('click', 'img.ani-reaction-select', function() {
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
	$("#ani-container").on('mousedown touchstart', 'div.ani-from-them svg.ani-sticker', function() { 
		var svgTag = this;
		pressTimer = window.setTimeout(function() { 
			$("#ani-picker").hide();
			animationObj.reactionStickerHolder(svgTag);
		},600);
		return false; 
	}).on('mouseup touchend', 'div.ani-from-them svg.ani-sticker', function() { 
		clearTimeout(pressTimer);
		return false;
	});
	
	// DEBUG
	// forcefully put a sticker from them     
	animationObj.addSticker(false, $("img.ani-sticker-select").eq(0));
	animationObj.addSticker(false, $("img.ani-sticker-select").eq(1));
	animationObj.addSticker(false, $("img.ani-sticker-select").eq(2));
});