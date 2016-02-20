//////////////////
// Dependencies //
//////////////////

var Express = require('express');

////////////
// Routes //
////////////

var router = Express.Router();

router.get('/', function (req, res) {
	res.render('dashboard/index', {
		_: {
			activePage: 'dashboard'
		}
	});
});

module.exports = router;