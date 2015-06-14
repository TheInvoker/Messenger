var stickerMasterList = [];
var masterMapping = [
	{
		folder : 'steve'
	},
	{
		folder : 'yeti'
	}
];

$(document).ready(function() {
	var lst = [];
	for (var i=0; i<masterMapping.length; i+=1) {
		var obj = masterMapping[i];
		lst.push(sprintf("<script src='images/%s/mapping.js'></script>", obj.folder));
	}	
	$("body").append(lst.join(""));
});