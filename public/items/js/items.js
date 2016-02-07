(function() {
	$('.play-btn').click(function () {
		var id = $(this).data('id');
		$.post('/items/play/' + id);
	});
}());