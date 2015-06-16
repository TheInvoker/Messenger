var selectedStickerObjectTag;

var stickerManager = new function() {

	var getStickerObj = function(objectTag, sklClass) {
		if (sklClass == "mammal") {
			return new mammal(objectTag, "body");
		}
	};

	var registerSticker = function(objectTag, sklClass) {
		var index = stickerList.length;
		objectTag.setAttribute("data-id", index);
		stickerList.push(getStickerObj(objectTag, sklClass));
	};

	var generateStickerHTML = function(fromYou, srcLink) {
		var outdiv = $(sprintf("<div class='message %s'/>", fromYou ? "from-you" : "from-them"));
		var indiv = $("<div class='sticker_wrapper svg'/>");
		var object = $(sprintf("<object data='%s' type='image/svg+xml' class='sticker'></object>", srcLink));
		outdiv.append(indiv);
		indiv.append(object);
		return [object, outdiv];
	};

	this.addSticker = function(fromYou, imgTag) {
		var src = $(imgTag);
		var mappingID = parseInt(src.attr("data-id"), 10);
		var mappingObj = masterStickerList[mappingID];
		var srcLink = mappingObj.stillSvg;
		var sklClass = mappingObj.sklcls;
		
		var data = generateStickerHTML(fromYou, srcLink),
			object = data[0],
			outdiv = data[1];
		$("#container").append(outdiv);
		
		object[0].addEventListener('load', function() {
			setTimeout(function() {
				$("#container").animate({ scrollTop: $('#container')[0].scrollHeight}, 'fast');
				registerSticker(object[0], sklClass);
			}, 1);
		});
	};

	this.addReactionSticker = function(fromYou, imgTag) {
		var src = $(imgTag);
		var mappingID = parseInt(src.attr("data-id"), 10);
		var mappingObj = masterStickerList[mappingID];
		var srcLink = mappingObj.stillSvg;
		var sklClass = mappingObj.sklcls;
		var moveType = src.attr("data-move-animation");
		var animationType = src.attr("data-action-animation");
		var otherAnimationType = src.attr("data-selection-animation");
		
		var data = generateStickerHTML(fromYou, srcLink),
			object = data[0],
			outdiv = data[1];
		$("#container").append(outdiv);
		
		object[0].addEventListener('load', function() {
			setTimeout(function() {
				// get animation object of new sticker
				var newStickerObj = getStickerObj(object[0], sklClass);
				// get animation object of selected sticker
				var selectedStickerObj = stickerList[selectedStickerObjectTag.attr("data-id")];
				
				// start an animation
				newStickerObj.animateAction(animationType, moveType, selectedStickerObjectTag, function() {
					// start the mini-reaction animation
					selectedStickerObj.animateReaction(otherAnimationType);
				});
			}, 1);
		});
	};
};



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
		stickerManager.addSticker(true, this);
		$("#picker").hide();
	});
	
	// when click on a reaction sticker from the drawer
	$("#reaction-picker").on('click', '.reaction_select', function() {
		stickerManager.addReactionSticker(true, this);
		$("#reaction-picker").hide();
	});
	
	// handle the double click event when the user double clicks on the sticker from the other person
	var stickerHolderFunction = function(imgTag) {
		$("#picker").hide();
		$("#reaction-picker").toggle();
		
		// save a reference to the sticker that was clicked on
		selectedStickerObjectTag = $(imgTag).find("object");
	};
	// for MOBILE
	var pressTimer;
	$('#container').on('touchstart', '.from-them .sticker_wrapper', function() { 
		var imgTag = this;
		pressTimer = window.setTimeout(function() { 
			stickerHolderFunction(imgTag);
		},600);
		return false; 
	}).on('touchend', '.from-them .sticker_wrapper', function() { 
		clearTimeout(pressTimer);
		return false;
	});
	// for DESKTOP
	$("#container").on('dblclick','.from-them .sticker_wrapper', function() {
		stickerHolderFunction(this);
	});
	
	// dynamically load all the stickers from the mapping list to the pickers
	var stickerlist = [], reactionlist = [];
	for(var i=0; i<masterStickerList.length; i+=1) {
		var stickerMapping = masterStickerList[i];
		if (stickerMapping.active) {
			stickerlist.push(sprintf("<img src='%s' class='sticker_select svg' data-id='%d'/>", stickerMapping.actionSvg, i));
			reactionlist.push(sprintf("<img src='%s' class='reaction_select svg' data-id='%d' data-move-animation='walk' data-action-animation='kick' data-selection-animation='twirl'/>", stickerMapping.actionSvg, i));
		}
	}
	$("#picker").html(stickerlist.join(""));
	$("#reaction-picker").html(reactionlist.join(""));
	
	// DEBUG
	// forcefully put a sticker from them     
	stickerManager.addSticker(false, $(".sticker_select").eq(0));
});