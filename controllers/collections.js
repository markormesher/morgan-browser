// dependencies

var express = require('express'),
	rfr = require('rfr'),
	mongoose = require('mongoose'),
	async = require('async'),
	helpers = rfr('./helpers/helpers');

// models

var Collection = rfr('./models/collection'),
	Item = rfr('./models/item');

// routes

var router = express.Router();

router.get('/:id?', function (req, res) {
	// collection id
	var id = req.params.id;

	// async tasks
	async.parallel({

		// get the collection "in focus"
		collection: function (c) {
			if (id == null) return c(null, null);
			Collection.get(id, function (result) {
				if (result == null) return c('not found', null);
				c(null, result);
			});
		},

		// get child collections
		child_collections: function (c) {
			Collection.Model.find({parent_id: id}).sort({title: 'asc'}).exec(function (err, result) {
				c(err, result);
			});
		},

		// get child items
		child_items: function (c) {
			Item.Model.find({collection_id: id}).sort({sequence: 'asc'}).exec(function (err, result) {
				c(err, result);
			});
		},

		// get collection breadcrumbs
		breadcrumbs: function (c) {
			// root?
			if (id == null) return c(null, []);

			// load this collection
			var breadcrumbs = [];
			Collection.get(id, function (result) {
				if (result == null) return c(null, null);

				// add to list
				breadcrumbs.push(result);

				// loop to keep progressively adding parents
				var addParent = function () {
					var lastCrumb = breadcrumbs[breadcrumbs.length - 1];

					// reached the root?
					if (!lastCrumb.parent_id) return c(null, breadcrumbs.reverse());

					// add the parent and loop
					Collection.get(lastCrumb.parent_id, function (result) {
						if (result == null) return c(err, null);
						breadcrumbs.push(result);
						addParent();
					});
				};
				addParent();
			});
		}

	}, function (err, results) {
		// check errors
		if (err) console.log(err);
		if (err == 'not found') {
			return helpers.errorRedirect(req, res, '/collections', 'Could not load collection');
		} else if (err) {
			// TODO: fix this
			return helpers.errorRedirect(req, res, '/', 'Something went wrong!');
		}

		// render collections
		res.render('collections/index', {
			_: {
				activePage: 'collections',
				title: 'Collections'
			},
			collection: results.collection,
			child_collections: results.child_collections,
			child_items: results.child_items,
			breadcrumbs: results.breadcrumbs
		});
	});
});

module.exports = router;