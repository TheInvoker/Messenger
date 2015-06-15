var selectedStickerObjectTag;

$(document).ready(function() {
	
	// when you click on send
	$("#send-button").click(function() {
		var val = $("#input-field").val();
		$("#input-field").val("");
	});
	
	// when you click the sticker button
	$("#sticker-button").click(function() {
		$("#picker").toggle();
		$("#reaction-picker").hide();
	});
	
	// when click on a regular sticker from the drawer
	$("#picker").on('click', '.sticker_select', function() {
		addSticker(true, this);
		$("#picker").hide();
	});
	
	// when click on a reaction sticker from the drawer
	$("#reaction-picker").on('click', '.reaction_select', function() {
		addReactionSticker(true, this);
		$("#reaction-picker").hide();
	});
	
	// handle the double click event when the user double clicks on the sticker from the other person
	$("#container").on('dblclick','.from-them .sticker_wrapper', function() {
		$("#picker").hide();
		$("#reaction-picker").toggle();
		
		// save a reference to the sticker that was clicked on
		selectedStickerObjectTag = $(this).find("object");
	});
	
	// dynamically load all the stickers from the mapping list to the pickers
	var stickerlist = [], reactionlist = [];
	for(var i=0; i<masterStickerList.length; i+=1) {
		var stickerMapping = masterStickerList[i];
		stickerlist.push(sprintf("<img src='%s' class='sticker_select svg' data-id='%d'/>", stickerMapping.actionSvg, i));
		reactionlist.push(sprintf("<img src='%s' class='reaction_select svg' data-id='%d'/>", stickerMapping.actionSvg, i));
	}
	$("#picker").html(stickerlist.join(""));
	$("#reaction-picker").html(reactionlist.join(""));
	
	// DEBUG
	// forcefully put a sticker from them     
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
	var moveType = src.attr("data-move-animation");
	var animationType = src.attr("data-action-animation");
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
			
			// start an animation
			newStickerObj.animateAction(animationType, selectedStickerObjectTag, function() {
				// start the mini-reaction animation
				selectedStickerObj.animateReaction(otherAnimationType);
			});
		}, 1);
	});
}