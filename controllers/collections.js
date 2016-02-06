// dependencies

var express = require('express');

// routes

var router = express.Router();

router.get('/', function (req, res) {
	res.render('collections/index', {
		_: {
			activePage: 'collections',
			title: 'Collections'
		}
	});
});

module.exports = router;