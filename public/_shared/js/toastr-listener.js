$(document).ready(function() {
	for (var type in toastrMessages) {
		var messages = toastrMessages[type];
		for (var msg in messages) {
			switch (type) {
				case 'error':
					toastr.error(messages[msg]);
					break;
				case 'info':
					toastr.info(messages[msg]);
					break;
				case 'success':
					toastr.success(messages[msg]);
					break;
				case 'warning':
					toastr.warning(messages[msg]);
					break;
			}
		}
	}
});