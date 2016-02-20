//////////////////
// Dependencies //
//////////////////

var Express = require('express');

////////////
// Routes //
////////////

var router = Express.Router();

router.get('/', function (req, res) {
	res.render('settings/index', {
		_: {
			activePage: 'settings',
			title: 'Settings'
		}
	});
});

module.exports = router;