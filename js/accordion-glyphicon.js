$(document).ready(function() {
	$(".panel-title > a").prepend('<i class="fa fa-plus-square"></i>');

	$('.panel-collapse').on('shown.bs.collapse', function () {
		 $(this).prev().find(".fa").removeClass("fa-plus-square").addClass("fa-minus-square");
	});
	
	//The reverse of the above on hidden event:
	$('.panel-collapse').on('hidden.bs.collapse', function () {
		 $(this).prev().find(".fa").removeClass("fa-minus-square").addClass("fa-plus-square");
	});
});
