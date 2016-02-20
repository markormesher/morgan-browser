(function () {
	$('.confirm-delete').click(function (e) {
		e.preventDefault();
		var link = $(this).attr('href');
		bootbox.confirm(
			'Are you sure you want to do this?',
			function (result) {
				if (result) {
					window.location.href = link;
				}
			}
		);
	});
}());