var stickerManager = new function() {

	var pressTimer;                     // record the long touch event
	var stickerList = [];               // records the animation objects
	var selectedStickerObjectTag;       // records pressed on sticker from other person

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
		
		// animation box event
		// COMMENTED THIS OUT BECAUSE IT STOPS THE CLICK EVENT FROM WORKING ON MOBILE
		/*
		$("#reaction-picker").on('mousedown touchstart', 'img', function() { 
			var imgTag = this;
			pressTimer = window.setTimeout(function() { 
				$("div.overlay, div.animation-preview").fadeIn();
			},600);
			return false; 
		}).on('mouseup touchend', 'img', function() { 
			clearTimeout(pressTimer);
			return false;
		});
		$("div.overlay").click(function() {
			$("div.overlay, div.animation-preview").fadeOut();
		});
		*/
		
		// handle closing of popup via swipe
		$(".popup-menu").swipe({
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
				if (direction=="left" || direction=="right") {
					$(this).toggle();
				}
			},
			threshold:75
		});
		
		// handle the hold event on the sticker from the other person
		$('#container').on('mousedown touchstart', '.from-them .sticker_wrapper', function() { 
			var imgTag = this;
			pressTimer = window.setTimeout(function() {

				// save a reference to the sticker that was clicked on
				selectedStickerObjectTag = $(imgTag).find("object");
				
				// finds all the reactions and adds them
				var selectedStickerObjIndex = parseInt($(selectedStickerObjectTag).attr("data-id"), 10);
				var selectedStickerObj = stickerList[selectedStickerObjIndex];
				var mappingObj = selectedStickerObj.getMappingObj();
				var reactionsList = mappingObj.reactions;
				var reactionlst = [];
				for(var i=0; i<reactionsList.length; i+=1) {
					var reaction = reactionsList[i];
					var reactionMappingObjIndex = getMappingIndexByName(reaction.name);
					var reactionMappingObj = masterStickerList[reactionMappingObjIndex];
					var reactionLink = reactionMappingObj.SVGList[reaction.reactionSVG];
					reactionlst.push(sprintf("<div class='img-container'><img src='%s' class='reaction_select svg' data-id='%d' data-move-animation='%s' data-action-animation='%s' data-reaction-animation='%s'/></div>", reactionLink, reactionMappingObjIndex, reaction.move_animation, reaction.action_animation, reaction.reaction_animation));
				}
				$("#reaction-picker").html(reactionlst.join(""));

				$("#picker").hide();
				$("#reaction-picker").show();
			},600);
			return false; 
		}).on('mouseup touchend', '.from-them .sticker_wrapper', function() { 
			clearTimeout(pressTimer);
			return false;
		});
		
		// dynamically load all the stickers from the mapping list to the sticker picker
		var stickerlst = [];
		for(var i=0; i<masterStickerList.length; i+=1) {
			var stickerMapping = masterStickerList[i];
			var svgList = stickerMapping.SVGList;
			var stickerSVGIndex = stickerMapping.stickerSVG;
			
			if (stickerMapping.active) {
				stickerlst.push(sprintf("<div class='img-container'><img src='%s' class='sticker_select svg' data-id='%d'/></div>", svgList[stickerSVGIndex], i));
			}
		}
		$("#picker").html(stickerlst.join(""));

		// DEBUG
		// forcefully put a sticker from them     
		stickerManager.addSticker(false, $(".sticker_select").eq(0));
		stickerManager.addSticker(false, $(".sticker_select").eq(0));
	});

	var getStickerObj = function(objectTag, sklClass, mappingObj) {
		if (sklClass == "mammal") {
			return new mammal(objectTag, mappingObj, "body");
		}
	};

	var registerSticker = function(objectTag, sklClass, mappingObj) {
		var index = stickerList.length;
		objectTag.setAttribute("data-id", index);
		var stickerObj = getStickerObj(objectTag, sklClass, mappingObj);
		stickerList.push(stickerObj);
	};

	var generateStickerHTML = function(fromYou, srcLink, isReaction) {
		var style = "";
		if (isReaction) {
			var targetPosition = $(selectedStickerObjectTag).position();
			var targetX = targetPosition.left;
			var targetY = targetPosition.top;
			var style = "left:" + $(selectedStickerObjectTag).width() + "px;";
		}
		
		var outdiv = $(sprintf("<div class='message %s'/>", fromYou ? "from-you" : "from-them"));
		var indiv = $("<div class='sticker_wrapper svg'/>");
		var object = $(sprintf("<object data='%s' type='image/svg+xml' class='sticker' style='%s'></object>", srcLink, style));
		outdiv.append(indiv);
		indiv.append(object);
		return [object, outdiv];
	};

	this.addSticker = function(fromYou, imgTag) {
		var src = $(imgTag);
		var mappingID = parseInt(src.attr("data-id"), 10);
		var mappingObj = masterStickerList[mappingID];
		var srcLink = mappingObj.SVGList[mappingObj.stickerSVG];
		var sklClass = mappingObj.sklcls;
		
		var data = generateStickerHTML(fromYou, srcLink, false),
			object = data[0],
			outdiv = data[1];
		$("#container").append(outdiv);
		
		object[0].addEventListener('load', function() {
			setTimeout(function() {
				registerSticker(object[0], sklClass, mappingObj);
				$("#container").animate({ scrollTop: $('#container')[0].scrollHeight}, 'fast');
			}, 1);
		});
	};

	this.addReactionSticker = function(fromYou, imgTag) {
		var src = $(imgTag);
		var mappingID = parseInt(src.attr("data-id"), 10);
		var mappingObj = masterStickerList[mappingID];
		var srcLink = mappingObj.SVGList[mappingObj.T_SVG];
		var sklClass = mappingObj.sklcls;
		var moveAnimationType = src.attr("data-move-animation");
		var actionAnimationType = src.attr("data-action-animation");
		var reactionAnimationType = src.attr("data-reaction-animation");
		
		var data = generateStickerHTML(fromYou, srcLink, true),
			object = data[0],
			outdiv = data[1];
		$("#container").append(outdiv);
		
		object[0].addEventListener('load', function() {
			setTimeout(function() {
				// get animation object of new sticker
				var newStickerObj = getStickerObj(object[0], sklClass, mappingObj);
				// get animation object of selected sticker
				var selectedStickerObj = stickerList[selectedStickerObjectTag.attr("data-id")];
				
				// start an animation
				newStickerObj.animateAction(actionAnimationType, moveAnimationType, selectedStickerObjectTag, function() {
					// start the mini-reaction animation
					selectedStickerObj.animateReaction(reactionAnimationType);
				});
			}, 1);
		});
	};
};