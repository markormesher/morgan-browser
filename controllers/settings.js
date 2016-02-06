// dependencies

var express = require('express');

// routes

var router = express.Router();

router.get('/', function (req, res) {
	res.render('settings/index', {
		_: {
			activePage: 'settings',
			title: 'Settings'
		}
	});
});

module.exports = router;