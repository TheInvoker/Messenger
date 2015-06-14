var selectedStickerObjectTag;

$(window).load(function() {
	$("#send-button").click(function() {
		var val = $("#input-field").val();
		$("#input-field").val("");
	});
	
	$("#sticker-button").click(function() {
		$("#picker").toggle();
		$("#reaction-picker").hide();
	});
	
	$("#picker").on('click', '.sticker_select', function() {
		addSticker(true, this);
		$("#picker").hide();
	});
	
	$("#reaction-picker").on('click', '.reaction_select', function() {
		addReactionSticker(true, this);
		$("#reaction-picker").hide();
	});
	
	$("#container").on('dblclick','.from-them .sticker_wrapper', function() {
		$("#picker").hide();
		$("#reaction-picker").toggle();
		selectedStickerObjectTag = $(this).find("object");
	});
	
	
	
	// force a sticker from them
	addSticker(false, $(".sticker_select").eq(0));
});






function getStickerObj(object, sklClass) {
	if (sklClass == "mammal") {
		return new mammal(object, "body");
	}
}
function registerSticker(object, sklClass) {
	var index = stickerList.length;
	object.setAttribute("data-id", index);
	stickerList.push(getStickerObj(object, sklClass));
}

function addSticker(fromYou, source) {
	var src = $(source);
	var srcLink = src.attr("src");
	var sklClass = src.attr("data-sklcls");
	
	var outdiv = $(sprintf("<div class='message %s'/>", fromYou ? "from-you" : "from-them"));
	var indiv = $("<div class='sticker_wrapper svg'/>");
	var object = $(sprintf("<object data='%s' type='image/svg+xml' class='sticker'></object>", srcLink));
	outdiv.append(indiv);
	indiv.append(object);
	$("#container").append(outdiv);
	
	object[0].addEventListener('load', function() {
		setTimeout(function() {
			$("#container").animate({ scrollTop: $('#container')[0].scrollHeight}, 'fast');
			registerSticker(object[0], sklClass);
		}, 1);
	});
}

function addReactionSticker(fromYou, source) {
	var src = $(source);
	var srcLink = src.attr("src");
	var sklClass = src.attr("data-sklcls");
	var animationType = src.attr("data-animation");
	var otherAnimationType = src.attr("data-selection-animation");
	
	var outdiv = $(sprintf("<div class='message %s'/>", fromYou ? "from-you" : "from-them"));
	var indiv = $("<div class='sticker_wrapper svg'/>");
	var object = $(sprintf("<object data='%s' type='image/svg+xml' class='sticker'></object>", srcLink));
	outdiv.append(indiv);
	indiv.append(object);
	$("#container").append(outdiv);
	
	object[0].addEventListener('load', function() {
		setTimeout(function() {
			// get animation object of new sticker
			var newStickerObj = getStickerObj(object[0], sklClass);
			// get animation object of selected sticker
			var selectedStickerObj = stickerList[selectedStickerObjectTag.attr("data-id")];
			
			newStickerObj.animateAction(animationType, selectedStickerObjectTag, function() {
				selectedStickerObj.animateReaction(otherAnimationType);
			});
		}, 1);
	});
}