// dependencies

var express = require('express'),
	rfr = require('rfr');

// routes

var router = express.Router();

// models

var Item = rfr('./models/item');

router.get('/:id', function (req, res) {
	// item id
	var id = req.params.id;

	// get item
	Item.get(id, function(item) {
		res.render('items/index', {
			_: {
				activePage: 'collections',
				title: 'Item'
			},
			item: item
		});
	});
});

module.exports = router;