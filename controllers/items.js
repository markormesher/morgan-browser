// dependencies

var express = require('express'),
	rfr = require('rfr'),
	spawn = require('child_process').spawn;

// routes

var router = express.Router();

// models

var Item = rfr('./models/item');

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
		spawn('omxplayer -d "' + item.file + '" > /dev/tty0');
	});
});

module.exports = router;