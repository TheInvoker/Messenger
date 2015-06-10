$(window).load(function() {
	$("#send-button").click(function() {
		var val = $("#input-field").val();
		$("#input-field").val("");
	});
	
	$("#sticker-button").click(function() {
		$("#picker").toggle();
	});
	
	$(".reaction").each(function(i, x) {
		x.addEventListener('load', function() {
			$(x.contentDocument).click(function() {
				
				var outdiv = $("<div class='message from-you'/>");
				var object = $("<object data='images/steve/steve.svg' type='image/svg+xml' class='sticker'></object>");
				outdiv.append(object);
				$("#container").append(outdiv);
				$("#picker").toggle();
				
				object[0].addEventListener('load', function() {
					setTimeout(function() {
						$("#container").animate({ scrollTop: $('#container')[0].scrollHeight}, 'fast', function(){
							var sticker = new mammal(object[0]);
							sticker.animate('explode');
						});
					}, 1);
					
					if (object.parent().hasClass("from-you")) {
						$(object[0].contentDocument).dblclick(function() {
							$("#picker").toggle();
						});
					}
				});
			}); 
		});
	});
});