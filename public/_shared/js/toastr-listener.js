$(document).ready(function() {
	for (var type in toastrMessages) {
		var messages = toastrMessages[type];
		for (var msg in messages) {
			switch (type) {
				case 'error':
					toastr.error(msg);
					break;
				case 'info':
					toastr.info(msg);
					break;
				case 'success':
					toastr.success(msg);
					break;
				case 'warning':
					toastr.warning(msg);
					break;
			}
		}
	}
});