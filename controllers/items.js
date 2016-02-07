//////////////////
// Dependencies //
//////////////////

var express = require('express'),
	rfr = require('rfr'),
	spawn = require('child_process').spawn;

////////////
// Models //
////////////

var Item = rfr('./models/item');

////////////
// Routes //
////////////

var router = express.Router();

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
		spawn('omxplayer', ['-d', item.file]);
	});
});

module.exports = router;