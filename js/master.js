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
				reactionSVG : 0,
				move_animation:'walk',
				action_animation:'kick',
				reaction_animation:'wobble',
				override_frameSVG:-1
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
			right_arm_group : [138, 78],
			left_arm_group : [63, 78],
			right_leg_group : [117, 140],
			left_leg_group : [90, 140]
		},
		reactions : [
			{
				name:'steve',
				move_animation:'walk',
				action_animation:'kick',
				reaction_animation:'wobble',
				override_frameSVG:-1
			}
		]
	}
];