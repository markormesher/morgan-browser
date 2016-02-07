//////////////////
// Dependencies //
//////////////////

var express = require('express');

////////////
// Routes //
////////////

var router = express.Router();

router.get('/', function (req, res) {
	res.render('dashboard/index', {
		_: {
			activePage: 'dashboard'
		}
	});
});

module.exports = router;