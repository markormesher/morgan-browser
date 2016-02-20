//////////////////
// Dependencies //
//////////////////

var Express = require('express');
var Rfr = require('rfr');
var Spawn = require('child_process').spawn;

////////////
// Models //
////////////

var Item = Rfr('./models/item');

////////////
// Routes //
////////////

var router = Express.Router();

router.get('/:id', function (req, res) {
	// item id
	var id = req.params.id;

	// get item
	Item.get(id, function (item) {
		res.render('items/index', {
			_: {
				activePage: 'collections',
				title: 'Item'
			},
			item: item,
			Item: Item
		});
	});
});

router.post('/play/:id', function (req, res) {
	// item id
	var id = req.params.id;

	// get item
	Item.get(id, function (item) {
		if (item == null) {
			res.status(404);
			res.end();
			return;
		}

		// open VLC
		Spawn('omxplayer', ['-d', item.file]);
	});
});

module.exports = router;