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

router.get('/delete/:id', function(req, res) {
	// item id
	var id = req.params.id;

	// delete the item
	Item.remove({id: id}, function(err) {
		if (err) {
			req.flash('error', 'Could not remove item');
		} else {
			req.flash('success', 'Item deleted');
		}

		res.writeHead(302, {Location: '/library'});
		res.end();
	});
});

router.get('/:id', function (req, res) {
	// item id
	var id = req.params.id;

	// get item
	Item.get({id: id, $single: true}, function (err, item) {
		if (err || !item) {
			req.flash('error', 'Could not load item');
			res.writeHead(302, {Location: '/collections'});
			return res.end();
		}

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
	Item.get({id: id, $single: true}, function (err, item) {
		if (err || !item) {
			res.status(404);
			res.end();
			return;
		}

		// open VLC
		Spawn('omxplayer', ['-d', item.file]);
	});
});

module.exports = router;