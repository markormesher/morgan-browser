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
		if (err) return helpers.errorToDashboard(req, res, 'Could not load collections!');

		// render collections
		res.render('collections/index', {
			_: {
				activePage: 'collections',
				title: 'Collections'
			},
			collections: [
				{_id: 'a', parent_id: null, title: 'Season 1'},
				{_id: 'a', parent_id: null, title: 'Season 2'},
				{_id: 'a', parent_id: null, title: 'Season 3'},
				{_id: 'a', parent_id: null, title: 'Season 4'},
				{_id: 'a', parent_id: null, title: 'Season 5'}
			],
			breadcrumbs: [
				{_id: 'a', parent_id: null, title: 'TV'},
				{_id: 'a', parent_id: null, title: 'Chuck'}
			]
		});
	});
});

router.get('/populate', function(req, res) {

});

module.exports = router;