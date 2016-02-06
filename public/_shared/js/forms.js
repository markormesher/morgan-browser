$(document).ready(function () {

	$('.switch-checkbox').each(function (i, e) {
		// get views
		e = $(e);
		var input = e.find('input');
		var icon = e.find('i').eq(0);

		// swap input for icon
		input.hide();
		icon.show();

		// set value
		var changeFunc = function () {
			if (input.is(':checked')) {
				icon.addClass('fa-toggle-on text-success').removeClass('fa-toggle-off text-muted');
			} else {
				icon.addClass('fa-toggle-off text-muted').removeClass('fa-toggle-on text-success');
			}
		};
		changeFunc();

		// set click listener
		input.change(function () {
			changeFunc();
		});
	});

	// "select all" checkboxes
	$('.select-all-checkboxes').each(function (i, e) {
		// get targets
		e = $(e);
		var targets = $(e.data('target'));

		// default state
		var allChecked = false;
		var checkState = function () {
			allChecked = targets.filter(':checked').length === targets.length;
			e.html(allChecked ? 'Deselect All' : 'Select All');
		};
		checkState();

		// update state when targets change
		targets.change(function () {
			checkState();
		});

		// change them all on click
		e.click(function (ev) {
			ev.preventDefault();
			var newState = !allChecked;
			targets.each(function (i, e) {
				$(e).prop('checked', newState).change();
			});
		});
	});

});