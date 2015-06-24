var animation = function(getContainerCallback, stickerInsertCallback) {
	
	var stickerList = [];                             // records the animation objects
	var selectedStickerObjectTagIndexList = [];       // records pressed on sticker from other person
	var masterStickerList = [
		{
			name : 'steve',
			sklcls : 'mammal',
			active : true,
			T_SVG : 0,
			stickerSVG : 0,
			SVGList : [
				'images/steve/steve.svg'
			],
			joints : {
				head_group : [200, 193],
				torso_group : [200, 237],
				right_arm_group : [227, 208],
				left_arm_group : [170, 208],
				right_leg_group : [220, 280],
				left_leg_group : [180, 280]
			},
			reactions : [
				{
					name:'yeti',
					reactionSVG:0,
					move_animation:'walk',
					action_animation:'slap',
					reaction_animation:'headBurst',
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
				'images/yeti/yeti-01.svg'
			],
			joints : {
				head_group : [96, 72],
				torso_group : [101, 99],
				right_arm_group : [130, 78],
				left_arm_group : [69, 78],
				right_leg_group : [117, 135],
				left_leg_group : [90, 135]
			},
			reactions : [
				{
					name:'steve',
					reactionSVG:0,
					move_animation:'walk',
					action_animation:'kick',
					reaction_animation:'wobble',
					chat_animation:'earthquake',
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
	
	this.reactionStickerHolder = function(imgTag, callback) {
		// get a reference to the sticker that was clicked on
		var selectedStickerObjectTag = $(imgTag).find("object");
		var selectedStickerObjectTagIndex = selectedStickerObjectTagIndexList.length;
		selectedStickerObjectTagIndexList.push(selectedStickerObjectTag);
		
		// if its not under an animation currently
		if ($(selectedStickerObjectTag).closest("div.ani-message").find("object").length==1 && !stickerList[$(selectedStickerObjectTag).attr("data-id")].isAnimating()) {
			
			// finds all the reactions and adds them
			var selectedStickerObjIndex = parseInt($(selectedStickerObjectTag).attr("data-id"), 10);
			var selectedStickerObj = stickerList[selectedStickerObjIndex];
			var mappingObj = selectedStickerObj.getMappingObj();
			var reactionsList = mappingObj.reactions;
			var reactionlst = [];
			for(var i=0; i<reactionsList.length; i+=1) {
				var reaction = reactionsList[i];
				var reactionMappingObjIndex = util.getMappingIndexByName(reaction.name);
				var reactionMappingObj = masterStickerList[reactionMappingObjIndex];
				var reactionLink = reactionMappingObj.SVGList[reaction.reactionSVG];
				reactionlst.push(sprintf("<div class='ani-img-container'><img src='%s' class='ani-reaction_select ani-svg' data-id='%d' data-move-animation='%s' data-action-animation='%s' data-reaction-animation='%s' data-chat-animation='%s' data-obj-id='%s'/></div>", reactionLink, reactionMappingObjIndex, reaction.move_animation, reaction.action_animation, reaction.reaction_animation, reaction.chat_animation, selectedStickerObjectTagIndex));
			}
			
			callback(reactionlst.join(""));
		}
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
			return $(cm).find("g,path,polygon,polyline");
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
		
		var getStickerObj = function(objectTag, sklClass, mappingObj) {
			if (sklClass == "mammal") {
				return new mammal(objectTag, mappingObj);
			}
		};

		var registerSticker = function(objectTag, sklClass, mappingObj) {
			var index = stickerList.length;
			objectTag.setAttribute("data-id", index);
			var stickerObj = getStickerObj(objectTag, sklClass, mappingObj);
			stickerList.push(stickerObj);
		};

		var generateStickerHTML = function(fromYou, srcLink, isReaction, selectedStickerObjectTag) {
			var indiv = $(sprintf("<div class='ani-sticker-wrapper ani-svg%s'/>", isReaction ? " ani-sticker-load" : ""));
			var object = $(sprintf("<object data='%s' type='image/svg+xml' class='ani-sticker'></object>", srcLink));
			indiv.append(object);
			
			if (isReaction) {
				indiv.css({
					'float':'right'
				});
				object.css({
					left : $(selectedStickerObjectTag).width() + "px"
				});
				return [object, indiv];
			}
			
			var outdiv = $(sprintf("<div class='ani-message %s'/>", fromYou ? "ani-from-you" : "ani-from-them"));
			outdiv.append(indiv);
			return [object, outdiv];
		};

		this.addSticker = function(fromYou, imgTag) {
			var src = $(imgTag);
			var mappingID = parseInt(src.attr("data-id"), 10);
			var mappingObj = masterStickerList[mappingID];
			var srcLink = mappingObj.SVGList[mappingObj.stickerSVG];
			var sklClass = mappingObj.sklcls;
			
			var data = generateStickerHTML(fromYou, srcLink, false, null),
				object = data[0],
				outdiv = data[1];
			getContainerCallback().append(outdiv);
			
			object[0].addEventListener('load', function() {
				setTimeout(function() {
					registerSticker(object[0], sklClass, mappingObj);
					
					var container = getContainerCallback();
					container.animate({ scrollTop: container[0].scrollHeight}, 'fast');
				}, 1);
			});
		};

		this.addReactionSticker = function(fromYou, imgTag) {
			var src = $(imgTag);
			var mappingID = parseInt(src.attr("data-id"), 10);
			var selectedStickerObjectTagIndex = parseInt(src.attr("data-obj-id"), 10);
			var mappingObj = masterStickerList[mappingID];
			var srcLink = mappingObj.SVGList[mappingObj.T_SVG];
			var sklClass = mappingObj.sklcls;
			var moveAnimationType = src.attr("data-move-animation");
			var actionAnimationType = src.attr("data-action-animation");
			var reactionAnimationType = src.attr("data-reaction-animation");
			var chatAnimationType = src.attr("data-chat-animation");
			var selectedStickerObjectTag = selectedStickerObjectTagIndexList[selectedStickerObjectTagIndex];
			
			var data = generateStickerHTML(fromYou, srcLink, true, selectedStickerObjectTag),
				object = data[0],
				indiv = data[1];
			$(selectedStickerObjectTag).closest("div.ani-message").append(indiv);

			object[0].addEventListener('load', function() {
				$(this).closest("div.ani-sticker-wrapper").removeClass("ani-sticker-load");
				
				setTimeout(function() {
					// get animation object of new sticker
					var newStickerObj = getStickerObj(object[0], sklClass, mappingObj);
					// get animation object of selected sticker
					var selectedStickerObj = stickerList[selectedStickerObjectTag.attr("data-id")];
					
					// start an animation
					newStickerObj.animateAction(actionAnimationType, moveAnimationType, chatAnimationType, selectedStickerObjectTag, function() {
						// start the mini-reaction animation
						selectedStickerObj.animateReaction(reactionAnimationType, selectedStickerObjectTag);
					});
					
					//selectedStickerObj.animateChat('earthquake');
				}, 1);
			});
		};
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
				stickerlst.push(sprintf("<div class='ani-img-container'><img src='%s' class='ani-sticker_select ani-svg' data-id='%d'/></div>", svgList[stickerSVGIndex], i));
			}
		}
		stickerInsertCallback(stickerlst.join(""));
	};
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	

	var base = function(objectElement, child) {
		
		var node = this;
		var interval = -1;
		var main_group = objectElement.contentDocument.getElementById("main");
		var svgTag = $(main_group).parent();
		var w = parseInt(svgTag.attr("width").replace("px",""), 10);
		var h = parseInt(svgTag.attr("height").replace("px",""), 10);
		svgTag.attr("width", "100%");
		svgTag.attr("height", "100%");
		var main_component = new component(main_group, w, h, 0, 0);
		var componentList = util.getComponents(main_group).map(function(i, x) {
			return new component(x, w, h, w/2, h/2);
		});

		this.reset = function() {
			clearInterval(interval);
			interval = -1;
			
			main_component.reset();
			for(var i=0; i<componentList.length; i+=1) {
				componentList[i].reset();
			}
		};
		
		this.getMainComponent = function() {
			return main_component;
		};
		
		this.getWidth = function() {
			return w;
		};
		
		this.getHeight = function() {
			return h;
		};
		
		this.isAnimating = function() {
			return interval != -1;
		};
		
		
		
		// CSS TRANSITION ANIMATIONS
		
		this.moveToOther = function(selectedStickerObjectTag, moveCallback) {
			var myPosition = $(objectElement).position();
			var positionX = myPosition.left;
			var myW = $(objectElement).width();
			var targetPosition = $(selectedStickerObjectTag).position();
			var targetX = targetPosition.left;
			
			$(objectElement).animate({
				left: ((targetX-positionX) + myW*1.4) + "px"
			}, 1000, moveCallback);
		};
		
		this.moveToSelf = function(selectedStickerObjectTag, moveCallback) {
			$(objectElement).animate({
				left: "0px"
			}, 1000, moveCallback);
		};
		
		this.moveBack = function() {
			$(objectElement).animate({
				opacity:0
			},500,function() {
				$(objectElement).closest("div.ani-sticker-wrapper").remove();
			});
		};
		
		
		
		
		
		
		// CHAT ANIMATIONS
		
		var earthquake = function() {
			var container = getContainerCallback();
			var step = 0, mag = 0.75, decayFactor = 0.99;
			var interval = setInterval(function() { 
				container.css({
					top : (7*Math.sin(step)) + "px"
				});
				step += mag;
				if (step > 150) {
					mag *= decayFactor;
				}
			}, 1);
			setTimeout(function() {
				clearInterval(interval);
				container.animate({
					top : "0px"
				}, 100);
			}, 3000);
		};
		
		// MOVING ANIMATIONS 
		
		// ACTION ANIMATIONS  
		
		var piss = function(selectedStickerObjectTag, miniReactionCallback) {
			var position = $(objectElement).position();
			var positionX = position.left + ($(objectElement).width() * 0.5);
			var positionY = position.top + ($(objectElement).height() * 0.7);
			
			var targetPosition = $(selectedStickerObjectTag).position();
			var targetX = targetPosition.left + ($(selectedStickerObjectTag).width() * 0.5);
			var targetY = targetPosition.top + ($(selectedStickerObjectTag).height() * 0.5);
			
			new particleGenerator(selectedStickerObjectTag, positionX, positionY, targetX, targetY, 10, 5, "yellow", 100, 1000, miniReactionCallback);
		};
		
		// REACTION ANIMATIONS  
		
		var explode = function(selectedStickerObjectTag) {	
			var i, l = componentList.length, step = 0, rot = 0;
			for(i=0; i<l; i+=1) {
				componentList[i].initMove();
			}
			
			interval = setInterval(function() { 
				for(i=0; i<l; i+=1) {	
					var cm = componentList[i];
				
					var vx = cm.getAttr("speed-x"),
						vy = cm.getAttr("speed-y"),
						px = cm.getAttr("data-px"),
						py = cm.getAttr("data-py");
					
					px += vx;
					py -= vy;
					vy -= 0.1;
					
					cm.transform(rot, 1, 1, w/2, h/2, px, py);
					
					cm.setAttr("speed-y", vy);
					cm.setAttr("speed-x", vx);
					cm.setAttr("data-px", px);
					cm.setAttr("data-py", py);
				}
				rot += 0.2;
				step += 0.002;
			}, 1);
			
			setTimeout(function() {
				child.reset();
			}, 3000);
			
			var position = $(objectElement).position();
			var positionX = position.left + ($(objectElement).width() * 0.5);
			var positionY = position.top + ($(objectElement).height() * 0.5);
			particleGenerator(selectedStickerObjectTag, positionX, positionY, positionX, positionY - $(objectElement).height()/2, 0, 180, "orange", 0, 200, function() {});
			particleGenerator(selectedStickerObjectTag, positionX, positionY, positionX, positionY - $(objectElement).height()/2, 0, 180, "yellow", 0, 200, function() {});
			particleGenerator(selectedStickerObjectTag, positionX, positionY, positionX, positionY - $(objectElement).height()/2, 0, 180, "red", 0, 200, function() {});
		};
		
		var wobble = function() {
			var step = 0, sinscale = 0.1;
			interval = setInterval(function() { 
				main_component.transform(0, 1+Math.sin(step)*sinscale, 1-Math.sin(step)*sinscale, w/2, h/2, 0, 0);
				step += 0.05;
				if (step > 9 && Math.abs(step % Math.PI) < 0.01) {
					child.reset();
				}
			}, 1);
		};	
		
		var twirl = function() {
			var step = 0;
			interval = setInterval(function() { 
				main_component.transform(step, 1, 1, w/2, h/2, 0, 0);
				step += 3;
				if (step > 360) {
					child.reset();
				}
			}, 1);
		};
		
		var headBloodBurst = function(selectedStickerObjectTag) {
			var w = $(objectElement).width();
			var h = $(objectElement).height();
			var position = $(objectElement).position();
			var positionX = position.left + ($(objectElement).width() * 0.5);
			var positionY = position.top + ($(objectElement).height() * 0.5);
			particleGenerator(selectedStickerObjectTag, positionX, positionY, positionX, positionY - h/2, 90, 45, "red", 100, 2000, function() {});
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
		
		this.animateMove = function(animationType) {
			switch(animationType) {

			}
			return false;
		};
		
		this.animateAction = function(animationType, moveType, selectedStickerObjectTag, miniReactionCallback) {
			switch(animationType) {
				case 'piss':
					node.moveToSelf(selectedStickerObjectTag, function() {
						child.reset();
						piss(selectedStickerObjectTag, function() {
							miniReactionCallback();
							node.moveBack();
						});
					});
					return true;
			} 
			return false;
		};
		
		this.animateReaction = function(animationType, selectedStickerObjectTag) {
			switch(animationType) {
				case 'explode':
					explode(selectedStickerObjectTag);
					return true;
				case 'wobble':
					wobble();
					return true;
				case 'twirl':
					twirl();
					return true;
				case 'headBurst':
					headBloodBurst(selectedStickerObjectTag);
					return true;
			} 
			return false;
		};	
	};
	
	
	var mammal = function(objectElement, mappingObj) {
		
		var node = this;
		var interval = -1;
		var innerSvg = objectElement.contentDocument; 
		var parent = new base(objectElement, this);
		var w = parent.getWidth(), h = parent.getHeight();
		var joints = mappingObj.joints;
		
		// get the main group
		var main = parent.getMainComponent();
		// get all the main groups
		var head = new component(innerSvg.getElementById("head_group"), w, h, joints.head_group[0], joints.head_group[1]);
		var torso = new component(innerSvg.getElementById("torso_group"), w, h, joints.torso_group[0], joints.torso_group[1]);
		var rightArm = new component(innerSvg.getElementById("right_arm_group"), w, h, joints.right_arm_group[0], joints.right_arm_group[1]);
		var leftArm = new component(innerSvg.getElementById("left_arm_group"), w, h, joints.left_arm_group[0], joints.left_arm_group[1]);
		var rightLeg = new component(innerSvg.getElementById("right_leg_group"), w, h, joints.right_leg_group[0], joints.right_leg_group[1]);
		var leftLeg = new component(innerSvg.getElementById("left_leg_group"), w, h, joints.left_leg_group[0], joints.left_leg_group[1]);
		
		this.reset = function() {
			clearInterval(interval);
			interval = -1;
			
			parent.reset();
		};
		
		this.getMappingObj = function() {
			return mappingObj;
		};
		
		this.isAnimating = function() {
			return interval != -1 && parent.isAnimating();
		};
		
		
		
		// MOVING ANIMATIONS  
		
		var walk = function() {
			var step = 0, rotation_angle = 50, head_angle = 10, torso_angle = 5, arm_angle = 15;
			interval = setInterval(function() {
				main.transform(-(Math.sin(step * 0.8)) * head_angle, 1, 1, w/2, h/2, 0, 0);
				head.transform(-(Math.cos(step * 0.8)) * torso_angle, 1, 1, 0, 0, 0, 0);
				torso.transform(-(Math.cos(step * 0.8)) * torso_angle, 1, 1, 0, 0, 0, 0);
				leftArm.transform((Math.sin(step * 0.8)) * arm_angle, 1, 1, 0, 0, 0, 0);
				rightArm.transform(-(Math.cos(step * 0.8)) * arm_angle, 1, 1, 0, 0, 0, 0);
				rightLeg.transform(-(Math.cos(step)) * rotation_angle, 1, 1, 0, 0, 0, 0);
				leftLeg.transform((Math.sin(step)) * rotation_angle, 1, 1, 0, 0, 0, 0);
				step += 0.1;
			}, 0.5);                             
		};
		
		// ACTION ANIMATIONS  
		
		var kick = function(callback) {
			var step = 0, rotation_angle = -80;
			interval = setInterval(function() {
				leftLeg.transform((Math.sin(step)+1)/2 * -rotation_angle, 1, 1, 0, 0, 0, 0);
				main.transform(-(Math.sin(step * 0.8)) * rotation_angle*0.5, 1, 1, w/2, h/2, 0, 0);
				
				step += 0.1;
				if (step > 4.2) {
					node.reset();
					callback();
				}
			}, 1);
		};
		
		var slap = function(callback) {
			var step = 0, rotation_angle = 40;
			interval = setInterval(function() {
				leftArm.transform(-Math.sin(step) * 150, 1, 1, 0, 0, 0, 0);
				
				step += 0.1;
				if (step > 3.5) {
					node.reset();
					callback();
				}
			}, 10);
		};
		
		var dance = function(callback) {
			var step = 0, rotation_angle = 40;
			interval = setInterval(function() {
				head.transform((Math.cos(step))/2 * -rotation_angle, 1, 1, 0, 0, 0, 0);
				torso.transform((Math.sin(step))/2 * -rotation_angle/4, 1, 1, 0, 0, 0, 0);
				rightArm.transform((Math.cos(step))/2 * -rotation_angle-90, 1, 1, 0, 0, 0, 0);
				leftArm.transform((Math.sin(step))/2 * -rotation_angle+90, 1, 1, 0, 0, 0, 0);
				rightLeg.transform((Math.cos(step))/2 * -rotation_angle, 1, 1, 0, 0, 0, 0);
				leftLeg.transform((Math.sin(step))/2 * rotation_angle, 1, 1, 0, 0, 0, 0);
				
				step += 0.1;
				if (step > 16) {
					node.reset();
					callback();
				}
			}, 10);
		};
		
		// REACTION ANIMATIONS  
		
		var jump = function() {
			var step = 0;
			interval = setInterval(function() { 
				var scale = 1;
				head.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
				torso.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
				rightArm.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
				leftArm.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
				rightLeg.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
				leftLeg.transform(0, scale, scale, 0, 0, 0, -10*(Math.sin(step)+1));
				step += 0.1;
			}, 1);
			
			setTimeout(function() {
				node.reset();
			}, 200);
		};
		

		// ANIMATION HANDLERS

		var animateChat = function(animationType) {
			switch(animationType) {
				case '':
					break;
				default:
					if (!parent.animateChat(animationType)) {
						alert(sprintf("Error: Chat animation '%s' does not exist.", animationType));
					}
			}
		};
		
		var animateMove = function(animationType) {
			switch(animationType) {
				case 'walk':
					walk();
					break;
				default:
					if (!parent.animateMove(animationType)) {
						alert(sprintf("Error: Move animation '%s' does not exist.", animationType));
					}
			}
		};
		
		this.animateAction = function(animationType, moveType, chatType, selectedStickerObjectTag, miniReactionCallback) {
			node.reset();
			animateChat(chatType);
			animateMove(moveType);
	
			switch(animationType) {
				case 'kick':
					parent.moveToOther(selectedStickerObjectTag, function() {
						node.reset();
						kick(function() {
							miniReactionCallback();
							parent.moveBack();
						});
					});
					break;
				case 'dance':
					parent.moveToOther(selectedStickerObjectTag, function() {
						node.reset();
						dance(function() {
							miniReactionCallback();
							parent.moveBack();
						});
					});
					break;
				case 'slap':
					parent.moveToOther(selectedStickerObjectTag, function() {
						node.reset();
						slap(function() {
							miniReactionCallback();
							parent.moveBack();
						});
					});
					break;
				default:
					if (!parent.animateAction(animationType, moveType, selectedStickerObjectTag, miniReactionCallback)) {
						alert(sprintf("Error: Action animation '%s' does not exist.", animationType));
					}
			} 
		};
		
		this.animateReaction = function(animationType, selectedStickerObjectTag) {
			node.reset();
			
			switch(animationType) {
				case 'jump':
					jump();
					break;
				default:
					if (!parent.animateReaction(animationType, selectedStickerObjectTag)) {
						alert(sprintf("Error: Reaction animation '%s' does not exist.", animationType));
					}
			} 
		};
	};
	
	
	
	var component = function(cm, w, h, jx, jy) {
		
		var node = this;
		var metaData = {};

		this.transform = function(degree, scale_x, scale_y, offset_x, offset_y, move_x, move_y) {
			var rad = degree * (Math.PI/180);
			var sx = scale_x;
			var sy = scale_y;
			var cos = Math.cos(rad);
			var sin = Math.sin(rad);
			var cx = jx + offset_x;
			var cy = jy + offset_y;
			var tx = (w * (1 - sx))/2 + move_x;
			var ty = (h * (1 - sy))/2 + move_y;
			var matrix = sprintf('matrix(%f,%f,%f,%f,%f,%f)', sx*cos, sy*sin, -sx*sin, sy*cos, (-cx*cos + cy*sin + cx)*sx + tx, (-cx*sin - cy*cos + cy)*sy + ty);
			cm.setAttribute('transform', matrix);
		};
		
		this.reset = function() {
			node.transform(0, 1, 1, 0, 0, 0, 0);
		};
		
		this.getAttr = function(attr) {
			return metaData[attr];
		};
		
		this.setAttr = function(attr, val) {
			metaData[attr] = val;
		};
		
		this.initMove = function() {
			metaData["speed-x"] = util.getRandomArbitrary(-2,2);
			metaData["speed-y"] = util.getRandomArbitrary(2,4);
			metaData["data-px"] = 0;
			metaData["data-py"] = 0;
		};
		
		this.getLeftOffset = function() {
			return $(cm).position().left;
		};
		
		this.getTopOffset = function() {
			return $(cm).position().top;
		};
		
		this.getPosition = function() {
			return cm.getBoundingClientRect();
		};
		
		this.getWidth = function() {
			return cm.getBBox().width;
		};
		
		this.getHeight = function() {
			return cm.getBBox().height;
		};
	};
	
	
	var particleGenerator = function(selectedStickerObjectTag, positionX, positionY, targetX, targetY, dist_variance, angle_variance, color, curve, duration, miniReactionCallback) {
		
		var particleList = [];
		
		var EE = setInterval(function() {
			var dist = Math.sqrt(Math.pow(targetX-positionX, 2) + Math.pow(targetY-positionY, 2));
			var degree = Math.atan2(targetY - positionY, targetX - positionX) * 180 / Math.PI;
			dist += dist_variance * ((Math.random()*2)-1);
			degree += angle_variance * ((Math.random()*2)-1);
			
			var tag = sprintf("<div class='ani-particle' style='background-color:%s;' />",color);
			var particle = $(tag);
			particleList.push({
				obj : particle,
				step : 0,
				dist : dist,
				angle : degree
			});
			$(selectedStickerObjectTag).closest("div.ani-message").append(particle);
			
			var particlePosition = $(particle).position();
			particle.css({
				left: positionX + 'px',
				top: positionY + 'px',
			});
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
				
				var data = util.length_dir(step, angle);
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
	
	
	
	
	var effect_explosion = function() {
		
	};
};