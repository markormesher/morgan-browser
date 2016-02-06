// dependencies

var express = require('express');

// routes

var router = express.Router();

router.get('/', function (req, res) {
	res.render('dashboard/index', {
		_: {
			activePage: 'dashboard',
			title: null
		}
	});
});

module.exports = router;