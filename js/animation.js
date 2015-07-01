var animation = function(getContainerCallback, stickerInsertCallback) {
	
	var stickerList = [];                          // records the animation objects
	var selectedStickerSvgTagIndexList = [];       // records pressed on sticker from other person
	var masterStickerList = [
		{
			name : 'steve',
			sklcls : 'mammal',
			active : true,
			T_SVG : 0,
			stickerSVG : 0,
			SVGList : [
				'images/stickers/steve/steve.svg'
			],
			joints : {
				head_group : ['50%', '95%'],
				torso_group : ['50%', '50%'],
				right_arm_group : ['-10%', '10%'],
				left_arm_group : ['90%', '10%'],
				right_leg_group : ['50%', '-10%'],
				left_leg_group : ['50%', '-10%']
			},
			reactions : [
				{
					name:'yeti',
					reactionSVG:0,
					move_animation:'walkToThem',
					action_animation:'kick',
					reaction_animation:'explode',
					chat_animation:'',
					custom_move_animationSVG : -1,
					custom_action_animationSVG: -1,
					custom_reaction_animationSVG: -1
				},
				{
					name:'yeti',
					reactionSVG:0,
					move_animation:'walkToThem',
					action_animation:'slap',
					reaction_animation:'wobble',
					chat_animation:'',
					custom_move_animationSVG : -1,
					custom_action_animationSVG: -1,
					custom_reaction_animationSVG: -1
				},
				{
					name:'yeti',
					reactionSVG:0,
					move_animation:'walkToThem',
					action_animation:'dance',
					reaction_animation:'twirl',
					chat_animation:'',
					custom_move_animationSVG : -1,
					custom_action_animationSVG: -1,
					custom_reaction_animationSVG: -1
				}
			]
		},
		{
			name : 'yeti',
			sklcls : 'mammal',
			active : true,
			T_SVG : 0,
			stickerSVG : 0,
			SVGList : [
				'images/stickers/yeti/yeti-01.svg'
			],
			joints : {
				head_group : ['50%', '50%'],
				torso_group : ['50%', '50%'],
				right_arm_group : ['-5%', '95%'],
				left_arm_group : ['105%', '95%'],
				right_leg_group : ['50%', '-10%'],
				left_leg_group : ['50%', '-10%']
			},
			reactions : [
				{
					name:'steve',
					reactionSVG:0,
					move_animation:'walkToThem',
					action_animation:'dance',
					reaction_animation:'jump',
					chat_animation:'',
					custom_move_animationSVG : -1,
					custom_action_animationSVG: -1,
					custom_reaction_animationSVG: -1
				}
			]
		}
	];

	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// API CODE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	this.addSticker = function(fromYou, imgTag) {
		controller.addSticker(fromYou, imgTag);
	};
	
	this.addReactionSticker = function(fromYou, imgTag) {
		controller.addReactionSticker(fromYou, imgTag);
	};
	
	this.reactionStickerHolder = function(svgTag, callback) {
		controller.reactionStickerHolder(svgTag, callback);
	};
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	var util = new function() {
		
		/**
		 * Returns a random number between min (inclusive) and max (exclusive)
		 */
		this.getRandomArbitrary = function(min, max) {
			return Math.random() * (max - min) + min;
		};

		this.length_dir = function(len, degree) {
			var rad = degree * (Math.PI/180); 
			var x = len * Math.cos(rad);
			var y = len * Math.sin(rad);
			return [x,y];
		};

		this.getComponents = function(cm) {
			return $(cm).find("path,polygon,polyline");
		};

		this.getMappingIndexByName = function(name) {
			for(var i=0; i<masterStickerList.length; i+=1) {
				if (masterStickerList[i].name == name) {
					return i;
				}
			}
			return -1;
		};
	};

	var controller = new function() {
		
		var getStickerObj = function(svgTag, sklClass, mappingObj) {
			if (sklClass == "mammal") {
				return new mammal(svgTag, mappingObj);
			}
		};

		var registerSticker = function(svgTag, sklClass, mappingObj) {
			var index = stickerList.length;
			svgTag.attr("data-id", index);
			var stickerObj = getStickerObj(svgTag, sklClass, mappingObj);
			stickerList.push(stickerObj);
		};

		var generateStickerHTML = function(fromYou, srcLink, isReaction, selectedStickerSvgTag, callback) {
			$.get(srcLink, function(data) {
				var svgTag = $(data).find('svg');
				svgTag.attr("class", "ani-sticker");
				
				if (isReaction) {
					$(svgTag).css("float","right");
					TweenLite.to(svgTag, 0, {
						x : $(selectedStickerSvgTag).width()
					});
					callback(svgTag, svgTag);
				} else {
					var wrapperElement = $(sprintf("<div class='ani-message %s'/>", fromYou ? "ani-from-you" : "ani-from-them"));
					wrapperElement.append(svgTag);
					callback(svgTag, wrapperElement);
				}
			});
		};

		this.addSticker = function(fromYou, imgTag) {
			var src = $(imgTag);
			var mappingID = parseInt(src.attr("data-id"), 10);
			var mappingObj = masterStickerList[mappingID];
			var srcLink = mappingObj.SVGList[mappingObj.stickerSVG];
			var sklClass = mappingObj.sklcls;
			
			var data = generateStickerHTML(fromYou, srcLink, false, null, function(svgTag, wrapperElement) {
				getContainerCallback().append(wrapperElement);
				
				registerSticker(svgTag, sklClass, mappingObj);
				
				var container = getContainerCallback();
				container.animate({ scrollTop: container[0].scrollHeight}, 'fast');
			});
		};

		this.addReactionSticker = function(fromYou, imgTag) {
			var src = $(imgTag);
			var mappingID = parseInt(src.attr("data-id"), 10);
			var selectedStickerSvgTagIndex = parseInt(src.attr("data-obj-id"), 10);
			var mappingObj = masterStickerList[mappingID];
			var srcLink = mappingObj.SVGList[mappingObj.T_SVG];
			var sklClass = mappingObj.sklcls;
			var moveAnimationType = src.attr("data-move-animation");
			var actionAnimationType = src.attr("data-action-animation");
			var reactionAnimationType = src.attr("data-reaction-animation");
			var chatAnimationType = src.attr("data-chat-animation");
			var selectedStickerSvgTag = selectedStickerSvgTagIndexList[selectedStickerSvgTagIndex];
			
			var data = generateStickerHTML(fromYou, srcLink, true, selectedStickerSvgTag, function(svgTag, wrapperElement) {
				selectedStickerSvgTag.closest("div.ani-message").append(wrapperElement);

				// get animation object of new sticker
				var newStickerObj = getStickerObj(svgTag, sklClass, mappingObj);
				// get animation object of selected sticker
				var selectedStickerObj = stickerList[selectedStickerSvgTag.attr("data-id")];

				// start an environment animation
				newStickerObj.animateChat(chatAnimationType);
				// start a move animation
				newStickerObj.animateMove(moveAnimationType, selectedStickerSvgTag, function() {
					// start an action animation
					newStickerObj.animateAction(actionAnimationType, selectedStickerSvgTag, function() {
						// start the mini-reaction animation
						selectedStickerObj.animateReaction(reactionAnimationType, selectedStickerSvgTag);
					});
				});
			});
		};
	
		this.reactionStickerHolder = function(svgTag, callback) {
			// get a reference to the sticker that was clicked on
			var selectedStickerSvgTag = $(svgTag);
			var selectedStickerSvgTagIndex = selectedStickerSvgTagIndexList.length;
			selectedStickerSvgTagIndexList.push(selectedStickerSvgTag);
			
			// if its not under an animation currently
			if (selectedStickerSvgTag.parent().find("svg").length==1) {
				
				// finds all the reactions and adds them
				var selectedStickerObjIndex = parseInt(selectedStickerSvgTag.attr("data-id"), 10);
				var selectedStickerObj = stickerList[selectedStickerObjIndex];
				var mappingObj = selectedStickerObj.getMappingObj();
				var reactionsList = mappingObj.reactions;
				var reactionlst = [];
				for(var i=0; i<reactionsList.length; i+=1) {
					var reaction = reactionsList[i];
					var reactionMappingObjIndex = util.getMappingIndexByName(reaction.name);
					var reactionMappingObj = masterStickerList[reactionMappingObjIndex];
					var reactionLink = reactionMappingObj.SVGList[reaction.reactionSVG];
					reactionlst.push(sprintf("<div class='ani-img-container'><img src='%s' class='ani-reaction-select ani-svg' data-id='%d' data-move-animation='%s' data-action-animation='%s' data-reaction-animation='%s' data-chat-animation='%s' data-obj-id='%s'/></div>", reactionLink, reactionMappingObjIndex, reaction.move_animation, reaction.action_animation, reaction.reaction_animation, reaction.chat_animation, selectedStickerSvgTagIndex));
				}
				
				callback(reactionlst.join(""));
			}
		}
	};

	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE CODE
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	new function() {
		// dynamically load all the stickers from the mapping list to the sticker picker
		var stickerlst = [];
		for(var i=0; i<masterStickerList.length; i+=1) {
			var stickerMapping = masterStickerList[i];
			var svgList = stickerMapping.SVGList;
			var stickerSVGIndex = stickerMapping.stickerSVG;
			
			if (stickerMapping.active) {
				stickerlst.push(sprintf("<div class='ani-img-container'><img src='%s' class='ani-sticker-select ani-svg' data-id='%d'/></div>", svgList[stickerSVGIndex], i));
			}
		}
		stickerInsertCallback(stickerlst.join(""));
	};
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	

	var base = function(svgTag) {
		
		var node = this;
		var w = parseInt(svgTag.attr("width").replace("px",""), 10);
		var h = parseInt(svgTag.attr("height").replace("px",""), 10);
		var main_group = svgTag.find("#main"); main_group.jx = '50%'; main_group.jy = '50%';
		var componentList = util.getComponents(main_group);
		
		this.getMainComponent = function() {
			return main_group;
		};
		
		this.getWidth = function() {
			return w;
		};
		
		this.getHeight = function() {
			return h;
		};
		
		
		
		// CSS TRANSITION ANIMATIONS
		
		this.moveToOther = function(selectedStickerSvgTag, moveCallback, moveTLs) {
			var myPosition = $(svgTag).position();
			var positionX = myPosition.left;
			var myW = $(svgTag).width();
			var targetPosition = $(selectedStickerSvgTag).position();
			var targetX = targetPosition.left;
			
			TweenLite.to(svgTag, 2, {
				x : ((targetX-positionX) + myW*1.4),
				onComplete : function() {
					for(var i=0; i<moveTLs.length; i+=1) {
						moveTLs[i].pause(0);
						moveTLs[i].clear();
					}
					moveCallback();
				}
			});
		};
		
		this.moveToSelf = function(selectedStickerSvgTag, moveCallback, moveTLs) {
			TweenLite.to(svgTag, 2, {
				x : 0,
				onComplete : function() {
					for(var i=0; i<moveTLs.length; i+=1) {
						moveTLs[i].pause(0);
						moveTLs[i].clear();
					}
					moveCallback();
				}
			});
		};
		
		this.moveBack = function() {
			TweenLite.to(svgTag, 0.5, {
				opacity : 0,
				onComplete : function() {
					$(svgTag).remove();
				}
			});
		};
		
		
		
		
		
		
		// CHAT ANIMATIONS
		
		var earthquake = function() {
			var container = getContainerCallback();			
			var duration = 0.05, magnitude = 10;
			
			var tl = new TimelineMax({
				repeat : 20,
				onComplete : function() {
					container.css("transform", "");
				}
			}).to(container, duration, {
				y : 1+magnitude
			}).to(container, duration, {
				y : 1-magnitude
			});
		};
		
		// MOVING ANIMATIONS 
		
		// ACTION ANIMATIONS  
		
		var piss = function(selectedStickerSvgTag, miniReactionCallback, moveBackCallback) {
			var position = $(svgTag).position();
			var positionX = position.left + ($(svgTag).width() * 0.5);
			var positionY = position.top + ($(svgTag).height() * 0.7);
			
			var targetPosition = $(selectedStickerSvgTag).position();
			var targetX = targetPosition.left + ($(selectedStickerSvgTag).width() * 0.5);
			var targetY = targetPosition.top + ($(selectedStickerSvgTag).height() * 0.5);
			
			new particleGenerator(selectedStickerSvgTag, positionX, positionY, targetX, targetY, $(selectedStickerSvgTag).width()/3.0, $(selectedStickerSvgTag).width()/3.0, "yellow", 100, 4000, function() {
				miniReactionCallback();
				moveBackCallback();
			}, 4);
		};
		
		// REACTION ANIMATIONS  
		
		var explode = function(selectedStickerSvgTag) {	
			var curve = h * Math.random();
			var duration = 1.7;
			var i, l = componentList.length;
			
			for(i=0; i<l; i+=1) {
				var obj = componentList[i];
				
				var sx = 0;
				var sy = 0;
				var ex = 1.5 * w * ((Math.random()*2)-1);
				var ey = h;
				var m = (sx+ex)/2.0;
				var m1 = (sx+m)/2.0;
				var m2 = (m+ex)/2.0;

				var tl = new TimelineMax().to(obj, duration, {
					bezier:{
						type:"soft", values:[
						{x:sx, y:sy}, 
						{x:m1, y:-curve}, 
						{x:m2, y:-curve}, 
						{x:ex, y:ey}], 
						autoRotate:false
					}, 
					onComplete:function(obj) {
						TweenLite.to(obj, 0, {x:0, y:0, rotation:0});
					},
					onCompleteParams:[obj],
					transformOrigin : "50% 50%",
					rotation:360*Math.random()
				});
			}
			
			var position = $(svgTag).position();
			var positionX = position.left + ($(svgTag).width() * 0.5);
			var positionY = position.top + ($(svgTag).height() * 0.5);
			
			effect_explosion(selectedStickerSvgTag, 'impact', positionX, positionY, positionX, positionY, 0.7, 0, 1, 1);
		};
		
		var wobble = function() {
			var duration = 0.1;
			var to = sprintf("%s %s", main_group.jx, main_group.jy);
			
			var tl = new TimelineMax({
				repeat : 5
			}).to(main_group, duration, {
				scaleX : 1.05,
				scaleY : 0.95,
				transformOrigin : to
			}).to(main_group, duration, {
				scaleX : 1,
				scaleY : 1,
				transformOrigin:to
			});
		};	
		
		var twirl = function() {
			var duration = 1;
			var to = sprintf("%s %s", main_group.jx, main_group.jy);
			
			var tl = new TimelineMax().to(main_group, duration, {
				rotation : 360,
				transformOrigin : to
			});
		};
		
		var headBloodBurst = function(selectedStickerSvgTag) {
			var w = $(svgTag).width();
			var h = $(svgTag).height();
			var position = $(svgTag).position();
			var positionX = position.left + ($(svgTag).width() * 0.5);
			var positionY = position.top + ($(svgTag).height() * 0.5);
			particleGenerator(selectedStickerSvgTag, positionX, positionY, positionX, positionY - h/2, w/2.0, w/2.0, "red", 100, 2000, function() {}, 2);
		};
		
		
		// ANIMATION HANDLERS
		
		this.animateChat = function(animationType) {
			switch(animationType) {
				case 'earthquake':
					earthquake();
					return true;
			} 
			return false;
		};
		
		this.animateMove = function(animationType, selectedStickerSvgTag, actionReactionCallback) {
			switch(animationType) {

			}
			return false;
		};
		
		this.animateAction = function(animationType, selectedStickerSvgTag, miniReactionCallback) {
			switch(animationType) {
				case 'piss':
					piss(selectedStickerSvgTag, miniReactionCallback, node.moveBack);
					return true;
			} 
			return false;
		};
		
		this.animateReaction = function(animationType, selectedStickerSvgTag) {
			switch(animationType) {
				case 'explode':
					explode(selectedStickerSvgTag);
					return true;
				case 'wobble':
					wobble();
					return true;
				case 'twirl':
					twirl();
					return true;
				case 'headBurst':
					headBloodBurst(selectedStickerSvgTag);
					return true;
			} 
			return false;
		};	
	};
	
	
	var mammal = function(svgTag, mappingObj) {
		
		var node = this;
		var parent = new base(svgTag);
		var w = parent.getWidth(), h = parent.getHeight();
		var joints = mappingObj.joints;
		
		// get the main group
		var main = parent.getMainComponent();
		// get all the main groups
		var head = svgTag.find("#head_group"); head.jx = joints.head_group[0]; head.jy = joints.head_group[1];
		var torso = svgTag.find("#torso_group"); torso.jx = joints.torso_group[0]; torso.jy = joints.torso_group[1];
		var rightArm = svgTag.find("#right_arm_group"); rightArm.jx = joints.right_arm_group[0]; rightArm.jy = joints.right_arm_group[1];
		var leftArm = svgTag.find("#left_arm_group"); leftArm.jx = joints.left_arm_group[0]; leftArm.jy = joints.left_arm_group[1];
		var rightLeg = svgTag.find("#right_leg_group"); rightLeg.jx = joints.right_leg_group[0]; rightLeg.jy = joints.right_leg_group[1];
		var leftLeg = svgTag.find("#left_leg_group"); leftLeg.jx = joints.left_leg_group[0]; leftLeg.jy = joints.left_leg_group[1];
		
		this.getMappingObj = function() {
			return mappingObj;
		};
		
		
		
		
		// MOVING ANIMATIONS  
		
		var walk = function(actionReactionCallback) {	
			var duration = 0.1;
			var rot1 = 2;
			var scl = 0.04;
			
			var to = sprintf("%s %s", leftLeg.jx, leftLeg.jy);
			var tl1 = new TimelineMax({
				repeat:-1
			}).to(leftLeg, duration*2, {
				scaleX:1-scl,
				rotation : 45,
				transformOrigin : to,
				ease:Power2.easeOut
			}).to(leftLeg, duration*4, {
				scaleX:1+scl,
				rotation : -45,
				transformOrigin : to,
				ease:Power2.easeInOut
			}).to(leftLeg, duration*2, {
				scaleX:1,
				rotation : 0,
				transformOrigin:to,
				ease:Power2.easeIn
			});
			
			var to = sprintf("%s %s", rightLeg.jx, rightLeg.jy);
			var tl2 = new TimelineMax({
				repeat:-1,
				delay:0.4
			}).to(rightLeg, duration*2, {
				scaleX:1-scl,
				rotation : 45,
				transformOrigin : to,
				ease:Power2.easeOut
			}).to(rightLeg, duration*4, {
				scaleX:1+scl,
				rotation : -45,
				transformOrigin : to,
				ease:Power2.easeInOut
			}).to(rightLeg, duration*2, {
				scaleX:1,
				rotation : 0,
				transformOrigin:to,
				ease:Power2.easeIn
			});
			
			var to = sprintf("%s %s", rightArm.jx, rightArm.jy);
			var tl3 = new TimelineMax({
				repeat:-1
			}).to(rightArm, duration*2, {
				scaleX:1-scl,
				rotation:rot1*5,
				transformOrigin:to
			}).to(rightArm, duration*4, {
				scaleX:1+scl,
				rotation:-rot1*5,
				transformOrigin:to
			}).to(rightArm, duration*2, {
				scaleX:1,
				rotation:0,
				transformOrigin:to
			});
			
			var to = sprintf("%s %s", leftArm.jx, leftArm.jy);
			var tl4 = new TimelineMax({
				repeat:-1
			}).to(leftArm, duration*2, {
				scaleX:1-scl,
				rotation:rot1*5,
				transformOrigin:to
			}).to(leftArm, duration*4, {
				scaleX:1+scl,
				rotation:-rot1*5,
				transformOrigin:to
			}).to(leftArm, duration*2, {
				scaleX:1,
				rotation:0,
				transformOrigin:to
			});
			
			var to = sprintf("%s %s", torso.jx, torso.jy);
			var tl5 = new TimelineMax({
				repeat:-1
			}).to(torso, duration*2, {
				scaleX:1-scl,
				rotation:rot1,
				transformOrigin : to
			}).to(torso, duration*4, {
				scaleX:1+scl,
				rotation:-rot1,
				transformOrigin : to
			}).to(torso, duration*2, {
				scaleX:1,
				rotation:0,
				transformOrigin : to
			});
			
			var to = sprintf("%s %s", head.jx, head.jy);
			var tl6 = new TimelineMax({
				repeat:-1
			}).to(head, duration*2, {
				scaleX:1-scl,
				rotation:rot1,
				transformOrigin : to
			}).to(head, duration*4, {
				scaleX:1+scl,
				rotation:-rot1,
				transformOrigin : to
			}).to(head, duration*2, {
				scaleX:1,
				rotation:0,
				transformOrigin : to
			});
			
			return [tl1, tl2, tl3, tl4, tl5, tl6];
		};
		
		// ACTION ANIMATIONS  
		
		var kick = function(miniReactionCallback, moveBackCallback) {			
			var duration = 0.2;
			
			var to = sprintf("%s %s", main.jx, main.jy);
			var tl = new TimelineMax().to(main, duration, {
				rotation : 10,
				transformOrigin : to
			}).to(main, duration, {
				rotation : 0,
				transformOrigin:to
			});
			
			var to = sprintf("%s %s", leftLeg.jx, leftLeg.jy);
			var tl = new TimelineMax().to(leftLeg, duration, {
				rotation : -30,
				transformOrigin : to
			}).to(leftLeg, duration, {
				rotation : 60,
				transformOrigin : to,
				onComplete : miniReactionCallback
			}).to(leftLeg, duration, {
				rotation : 0,
				transformOrigin : to,
				onComplete : moveBackCallback
			});
		};
		
		var slap = function(miniReactionCallback, moveBackCallback) {
			var duration = 0.2;
			
			var to = sprintf("%s %s", main.jx, main.jy);
			var tl = new TimelineMax().to(main, duration, {
				rotation : 5,
				transformOrigin : to
			}).to(main, duration, {
				rotation : 0,
				transformOrigin:to
			});
			
			var to = sprintf("%s %s", leftArm.jx, leftArm.jy);
			var tl = new TimelineMax().to(leftArm, duration, {
				rotation : -30,
				transformOrigin : to,
				ease:Power2.easeOut
			}).to(leftArm, duration, {
				rotation : 150,
				transformOrigin : to,
				ease:Power2.easeInOut,
				onComplete : miniReactionCallback
			}).to(leftArm, duration, {
				rotation : 0,
				transformOrigin : to,
				ease:Power2.easeIn,
				onComplete : moveBackCallback
			});
		};
		
		var dance = function(miniReactionCallback, moveBackCallback) {			
			var duration = 0.2;
			var lst = [head, torso, rightArm, leftArm, rightLeg, leftLeg];
			
			for(var i=0; i<lst.length; i+=1) {
				var obj = lst[i];
				var to = sprintf("%s %s", obj.jx, obj.jy);
				
				var r = i==0 ? {
					onComplete : function() {
						miniReactionCallback();
						moveBackCallback();
					}
				} : {};
				r["repeat"] = 3;
				
				var tl = new TimelineMax(r).to(obj, duration, {
					rotation : -30 * Math.pow(-1, i),
					transformOrigin : to
				}).to(obj, duration, {
					rotation : 30 * Math.pow(-1, i),
					transformOrigin : to
				}).to(obj, duration, {
					rotation : 0,
					transformOrigin : to
				});	
			}
		};
		
		// REACTION ANIMATIONS  
		
		var jump = function() {
			var duration = 0.1;

			var tl = new TimelineMax().to(main, duration, {
				y : -$(svgTag).height()/8.0,
				ease:Power2.easeOut,
			}).to(main, duration, {
				y : 0,
				ease:Power2.easeIn
			});
		};
		

		// ANIMATION HANDLERS

		this.animateChat = function(animationType) {
			switch(animationType) {
				case '':
					break;
				default:
					if (!parent.animateChat(animationType)) {
						alert(sprintf("Error: Chat animation '%s' does not exist.", animationType));
					}
			}
		};
		
		this.animateMove = function(animationType, selectedStickerSvgTag, actionReactionCallback) {
			switch(animationType) {
				case 'walkToThem':
					var moveTLs = walk();
					parent.moveToOther(selectedStickerSvgTag, actionReactionCallback, moveTLs);
					break;
				case 'walkABit':
					var moveTLs = walk();
					parent.moveToSelf(selectedStickerSvgTag, actionReactionCallback, moveTLs);
					break;
				default:
					if (!parent.animateMove(animationType, selectedStickerSvgTag, actionReactionCallback)) {
						alert(sprintf("Error: Move animation '%s' does not exist.", animationType));
					}
			}
		};
		
		this.animateAction = function(animationType, selectedStickerSvgTag, miniReactionCallback) {
			switch(animationType) {
				case 'kick':
					kick(miniReactionCallback, parent.moveBack);
					break;
				case 'dance':
					dance(miniReactionCallback, parent.moveBack);
					break;
				case 'slap':
					slap(miniReactionCallback, parent.moveBack);
					break;
				default:
					if (!parent.animateAction(animationType, selectedStickerSvgTag, miniReactionCallback)) {
						alert(sprintf("Error: Action animation '%s' does not exist.", animationType));
					}
			} 
		};
		
		this.animateReaction = function(animationType, selectedStickerSvgTag) {
			switch(animationType) {
				case 'jump':
					jump();
					break;
				default:
					if (!parent.animateReaction(animationType, selectedStickerSvgTag)) {
						alert(sprintf("Error: Reaction animation '%s' does not exist.", animationType));
					}
			} 
		};
	};
	
	
	var particleGenerator = function(selectedStickerSvgTag, positionX, positionY, targetX, targetY, dist_varianceX, dist_varianceY, color, curve, duration, miniReactionCallback, expireDuration) {
		
		var lastIndex = -1;
		var particleList = [];

		var EE = setInterval(function() {
			var tag = sprintf("<div class='ani-particle' style='background-color:%s;' />",color);
			var particle = $(tag);
			
			lastIndex += 1;
			particle.myIndex = lastIndex;

			$(selectedStickerSvgTag).parent().append(particle);
			
			var r1 = dist_varianceX * ((Math.random()*2)-1);
			var r2 = dist_varianceY * ((Math.random()*2)-1);
			
			var particlePosition = $(particle).position();
			var sx = positionX-particlePosition.left, sy = positionY-particlePosition.top;
			var ex = targetX-particlePosition.left + r1, ey = targetY-particlePosition.top + r2;
			
			var tl = new TimelineMax().to(particle, 0, {
				x : sx,
				y : sy
			}).to(particle, expireDuration, {
				bezier:{
					type:"soft", values:[
					{x:sx, y:sy}, 
					{x:(sx+ex)/2.0, y:-curve + (sy+ey)/2.0}, 
					{x:ex, y:ey}], 
					autoRotate:false
				}, 
				ease:Sine.easeOut,
				onComplete : function() {
					if (particle.myIndex == lastIndex) {
						miniReactionCallback();
					}
					particle.remove();
				}
			});
		}, 10);
		
		setTimeout(function() {
			clearInterval(EE);
		}, duration);
	};
	
	
	var effect_explosion = function(selectedStickerSvgTag, type, positionX, positionY, targetX, targetY, expireDuration, endRotation, endScale, endOpacity) {
		
		var effect_explosion_helper = function(selectedStickerSvgTag, positionX, positionY, targetX, targetY, expireDuration, endRotation, endScale, endOpacity, particle) {
			$(selectedStickerSvgTag).parent().prepend(particle);
			
			var particlePosition = $(particle).position();
			var sx = positionX-particlePosition.left, sy = positionY-particlePosition.top;
			var ex = targetX-particlePosition.left, ey = targetY-particlePosition.top;

			var resizePixW = $(selectedStickerSvgTag).width() * endScale;
			var resizePixH = $(selectedStickerSvgTag).height() * endScale;

			var tl = new TimelineMax().to(particle, 0, {
				x : sx,
				y : sy,
				width:'0px',
				height:'0px'
			}).to(particle, expireDuration, {
				x : (ex-resizePixW/2) + 'px',
				y : (ey-resizePixH/2) + 'px',
				width : resizePixW + 'px',
				height : resizePixH + 'px',
				transformOrigin : "50% 50%",
				rotation:endRotation,
				opacity:endOpacity,
				ease:Sine.easeOut,
				onComplete : function() {
					particle.remove();
				}
			});
		};
		
		if (type == "impact") {
			var url = 'images/effects/impact/hit_impact.svg';
			$.get(url, function(data) {
				var svgTag = $(data).find('svg');
				svgTag.attr("class", "ani-effect");
				effect_explosion_helper(selectedStickerSvgTag, positionX, positionY, targetX, targetY, expireDuration, endRotation, endScale, endOpacity, svgTag);
			});
		} else {
			var tag = $(sprintf("<div width=\"20px\" height=\"20px\" class=\"ani-effect\" style=\"background-color:%s;\" />", type));
			effect_explosion_helper(selectedStickerSvgTag, positionX, positionY, targetX, targetY, expireDuration, endRotation, endScale, endOpacity, tag);
		}
	};
};