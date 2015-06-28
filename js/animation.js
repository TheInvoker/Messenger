var animation = function(getContainerCallback, stickerInsertCallback) {
	
	var stickerList = [];                             // records the animation objects
	var selectedStickerSvgTagIndexList = [];       // records pressed on sticker from other person
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
					TweenLite.to(svgTag, 0, {
						x : $(window).width() - $(selectedStickerSvgTag).width()
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

				// start an animation
				newStickerObj.animateAction(actionAnimationType, moveAnimationType, chatAnimationType, selectedStickerSvgTag, function() {
					// start the mini-reaction animation
					selectedStickerObj.animateReaction(reactionAnimationType, selectedStickerSvgTag);
				});
			});
		};
	
		this.reactionStickerHolder = function(svgTag, callback) {
			// get a reference to the sticker that was clicked on
			var selectedStickerSvgTag = $(svgTag);
			var selectedStickerSvgTagIndex = selectedStickerSvgTagIndexList.length;
			selectedStickerSvgTagIndexList.push(selectedStickerSvgTag);
			
			// if its not under an animation currently
			if (selectedStickerSvgTag.parent().find("svg").length==1 && !stickerList[selectedStickerSvgTag.attr("data-id")].isAnimating()) {
				
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
	
	
	
	

	var base = function(svgTag, child) {
		
		var node = this;
		var w = parseInt(svgTag.attr("width").replace("px",""), 10);
		var h = parseInt(svgTag.attr("height").replace("px",""), 10);
		var main_group = svgTag.find("#main"); main_group.jx = '50%'; main_group.jy = '50%';
		var componentList = util.getComponents(main_group);

		this.reset = function() {
			
		};
		
		this.getMainComponent = function() {
			return main_group;
		};
		
		this.getWidth = function() {
			return w;
		};
		
		this.getHeight = function() {
			return h;
		};
		
		this.isAnimating = function() {
			return false
		};
		
		
		
		// CSS TRANSITION ANIMATIONS
		
		this.moveToOther = function(selectedStickerSvgTag, moveCallback) {
			TweenLite.to(svgTag, 1, {
				x : -$(svgTag).width() * 0.6,
				onComplete : moveCallback
			});
		};
		
		this.moveToSelf = function(selectedStickerSvgTag, moveCallback) {
			TweenLite.to(svgTag, 1, {
				x : $(window).width(),
				onComplete : moveCallback
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
		
		var piss = function(selectedStickerSvgTag, miniReactionCallback) {
			var position = $(svgTag).position();
			var positionX = position.left + ($(svgTag).width() * 0.5);
			var positionY = position.top + ($(svgTag).height() * 0.7);
			
			var targetPosition = $(selectedStickerSvgTag).position();
			var targetX = targetPosition.left + ($(selectedStickerSvgTag).width() * 0.5);
			var targetY = targetPosition.top + ($(selectedStickerSvgTag).height() * 0.5);
			
			new particleGenerator(selectedStickerSvgTag, positionX, positionY, targetX, targetY, 10, 5, "yellow", 100, 1000, miniReactionCallback);
		};
		
		// REACTION ANIMATIONS  
		
		var explode = function(selectedStickerSvgTag) {	
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
			
			var position = $(svgTag).position();
			var positionX = position.left + ($(svgTag).width() * 0.5);
			var positionY = position.top + ($(svgTag).height() * 0.5);
			particleGenerator(selectedStickerSvgTag, positionX, positionY, positionX, positionY - $(svgTag).height()/2, 0, 180, "orange", 0, 200, function() {});
			particleGenerator(selectedStickerSvgTag, positionX, positionY, positionX, positionY - $(svgTag).height()/2, 0, 180, "yellow", 0, 200, function() {});
			particleGenerator(selectedStickerSvgTag, positionX, positionY, positionX, positionY - $(svgTag).height()/2, 0, 180, "red", 0, 200, function() {});
		};
		
		var wobble = function() {
			/*
			var step = 0, sinscale = 0.1;
			interval = setInterval(function() { 
				main_component.transform(0, 1+Math.sin(step)*sinscale, 1-Math.sin(step)*sinscale, w/2, h/2, 0, 0);
				step += 0.05;
				if (step > 9 && Math.abs(step % Math.PI) < 0.01) {
					child.reset();
				}
			}, 1);
			*/
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
		
		var headBloodBurst = function(selectedStickerSvgTag) {
			var w = $(svgTag).width();
			var h = $(svgTag).height();
			var position = $(svgTag).position();
			var positionX = position.left + ($(svgTag).width() * 0.5);
			var positionY = position.top + ($(svgTag).height() * 0.5);
			particleGenerator(selectedStickerSvgTag, positionX, positionY, positionX, positionY - h/2, 90, 45, "red", 100, 2000, function() {});
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
		
		this.animateAction = function(animationType, moveType, selectedStickerSvgTag, miniReactionCallback) {
			switch(animationType) {
				case 'piss':
					node.moveToSelf(selectedStickerSvgTag, function() {
						child.reset();
						piss(selectedStickerSvgTag, function() {
							miniReactionCallback();
							node.moveBack();
						});
					});
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
		var interval = -1;
		var parent = new base(svgTag, this);
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
		
		this.reset = function() {
			clearInterval(interval);
			interval = -1;
			
			parent.reset();
		};
		
		this.getMappingObj = function() {
			return mappingObj;
		};
		
		this.isAnimating = function() {
			return interval != -1 || parent.isAnimating();
		};
		
		
		
		// MOVING ANIMATIONS  
		
		var walk = function() {
			/*
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
			*/			
		};
		
		// ACTION ANIMATIONS  
		
		var kick = function(callback) {
			/*
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
			*/
			callback();
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
		
		this.animateAction = function(animationType, moveType, chatType, selectedStickerSvgTag, miniReactionCallback) {
			node.reset();
			animateChat(chatType);
			animateMove(moveType);
	
			switch(animationType) {
				case 'kick':
					parent.moveToOther(selectedStickerSvgTag, function() {
						node.reset();
						kick(function() {
							miniReactionCallback();
							parent.moveBack();
						});
					});
					break;
				case 'dance':
					parent.moveToOther(selectedStickerSvgTag, function() {
						node.reset();
						dance(function() {
							miniReactionCallback();
							parent.moveBack();
						});
					});
					break;
				case 'slap':
					parent.moveToOther(selectedStickerSvgTag, function() {
						node.reset();
						slap(function() {
							miniReactionCallback();
							parent.moveBack();
						});
					});
					break;
				default:
					if (!parent.animateAction(animationType, moveType, selectedStickerSvgTag, miniReactionCallback)) {
						alert(sprintf("Error: Action animation '%s' does not exist.", animationType));
					}
			} 
		};
		
		this.animateReaction = function(animationType, selectedStickerSvgTag) {
			node.reset();
			
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
	
	
	/*
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
			cm.attr('transform', matrix);
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
	*/
	
	var particleGenerator = function(selectedStickerSvgTag, positionX, positionY, targetX, targetY, dist_variance, angle_variance, color, curve, duration, miniReactionCallback) {
		
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
			$(selectedStickerSvgTag).closest("div.ani-message").append(particle);
			
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
	
	
	
	
	var effect_explosion = function(selectedStickerSvgTag, type, positionX, positionY, color) {
		
			var tag = sprintf("<div class='ani-effect' style='background-color:%s;'/>", color);
			var particle = $(tag);
			particleList.push({
				obj : particle,
				step : 0,
				dist : dist,
				angle : degree
			});
			$(selectedStickerSvgTag).closest("div.ani-message").append(particle);
		
	};
};