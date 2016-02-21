(function() {

	// show file path for ROOT collections only
	var parentCollection = $('#parent_id');
	var filePathGroup = $('.file-path-group');
	var toggleFilePath = function() {
		filePathGroup.toggle(parentCollection.val() == 0);
	};
	toggleFilePath();
	parentCollection.change(toggleFilePath);

}());