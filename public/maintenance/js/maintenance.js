(function () {

	// action buttons
	var mediaScanNowBtn = $('#media-scan-now');
	var orphanRemovalNowBtn = $('#orphan-removal-now');

	// media scan
	var mediaScanBusy = false;
	var mediaScan = function () {
		// progress update functions
		var start = function () {
			mediaScanBusy = true;
			mediaScanNowBtn.find('i').css({display: 'inline-block'});
		};
		var finish = function (err) {
			mediaScanBusy = false;
			mediaScanNowBtn.find('i').hide();
			if (!err) {
				toastr.success('Done');
			} else {
				toastr.error(err);
			}
		};

		// start progress
		if (mediaScanBusy) return;
		start();

		// TODO: do something

		// finish progress
		setTimeout(finish, 3000);
	};
	mediaScanNowBtn.click(mediaScan);

	// orphan removal
	var orphanRemovalBusy = false;
	var orphanRemoval = function () {
		// progress update functions
		var start = function () {
			orphanRemovalBusy = true;
			orphanRemovalNowBtn.find('i').css({display: 'inline-block'});
		};
		var finish = function (err) {
			orphanRemovalBusy = false;
			orphanRemovalNowBtn.find('i').hide();
			if (!err) {
				toastr.success('Done');
			} else {
				toastr.error(err);
			}
		};

		// start progress
		if (orphanRemovalBusy) return;
		start();

		// TODO: do something

		// finish progress
		setTimeout(finish, 3000);
	};
	orphanRemovalNowBtn.click(orphanRemoval);

}());