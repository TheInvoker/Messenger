$(window).load(function() {
	$("#send-button").click(function() {
		var val = $("#input-field").val();
		$("#input-field").val("");
	});
	
	$("#sticker-button").click(function() {
		$("#picker").slideToggle();
	});
	
	$("#picker").on('click', '.reaction_option', function() {
		var outdiv = $("<div class='message from-you'/>");
		var indiv = $("<div class='sticker_wrapper'/>");
		var object = $("<object data='images/yeti/yeti-01.svg' type='image/svg+xml' class='sticker'></object>");
		outdiv.append(indiv);
		indiv.append(object);
		$("#container").append(outdiv);
		$("#picker").toggle();
		
		object[0].addEventListener('load', function() {
			setTimeout(function() {
				$("#container").animate({ scrollTop: $('#container')[0].scrollHeight}, 'fast', function(){
					var sticker = new mammal(object[0]);
					sticker.animate('explode');
				});
			}, 1);
		});
	});
	
	$("#container").on('dblclick','.from-you .sticker_wrapper', function() {
		$("#picker").slideToggle();
	});
});