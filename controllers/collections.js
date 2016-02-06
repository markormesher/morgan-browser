// dependencies

var express = require('express'),
rfr = require('rfr'),
helpers = rfr('./helpers/helpers');

// models

var Collection = rfr('./models/collection');

// routes

var router = express.Router();

router.get('/', function (req, res) {
	// find all root collections
	Collection.find({parent_id: null}).sort({title: 'asc'}).exec(function(err, collections) {
		// check for error
		if (err || true) return helpers.errorToDashboard(req, res, 'Could not load collections!');

		// render collections
		res.render('collections/index', {
			_: {
				activePage: 'collections',
				title: 'Collections'
			},
			err: err,
			collections: collections
		});
	});
});

module.exports = router;