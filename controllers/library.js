//////////////////
// Dependencies //
//////////////////

var Express = require('express');
var Rfr = require('rfr');
var Async = require('async');

////////////
// Models //
////////////

var Collection = Rfr('./models/collection');
var Item = Rfr('./models/item');

////////////
// Routes //
////////////

var router = Express.Router();

router.get('/delete/:id', function(req, res) {
	// collection id
	var id = req.params.id;

	// delete the collection
	Collection.remove({id: id}, function(err) {
		if (err) {
			req.flash('error', 'Could not remove collection');
		} else {
			req.flash('success', 'Collection deleted');
		}

		res.writeHead(302, {Location: '/library'});
		res.end();
	});
});

router.get('/:id?', function (req, res) {
	// collection id
	var id = req.params.id;

	// async tasks
	Async.parallel({

		// get the collection "in focus"
		collection: function (c) {
			if (id == null) return c(null, null);
			Collection.get({id: id, $single: true}, function (err, result) {
				if (err || !result) return c('not found', null);
				c(null, result);
			});
		},

		// get child collections
		child_collections: function (c) {
			Collection.get({parent_id: id}, function (err, result) {
				c(err, result);
			});
		},

		// get child items
		child_items: function (c) {
			Item.get({collection_id: id}, function (err, result) {
				c(err, result);
			});
		},

		// get collection breadcrumbs
		breadcrumbs: function (c) {
			// root?
			if (id == null) return c(null, []);

			// load this collection
			var breadcrumbs = [];
			Collection.get({id: id, $single: true}, function (err, result) {
				if (err || !result) return c('not found', null);

				// add to list
				breadcrumbs.push(result);

				// loop to keep progressively adding parents
				var addParent = function () {
					var lastCrumb = breadcrumbs[breadcrumbs.length - 1];

					// reached the root?
					if (!lastCrumb.parent_id) return c(null, breadcrumbs.reverse());

					// add the parent and loop
					Collection.get({id: lastCrumb.parent_id, $single: true}, function (err, result) {
						if (err || !result) return c(err, null);
						breadcrumbs.push(result);
						addParent();
					});
				};
				addParent();
			});
		}

	}, function (err, results) {
		// check errors
		if (err) {
			if (err == 'not found') {
				req.flash('error', 'Could not load collection');
				res.writeHead(302, {Location: '/library'})
			} else {
				req.flash('error', 'Collections could not be loaded!');
				res.writeHead(302, {Location: '/'})
			}
			return res.end();
		}

		console.log(results);

		// render collections
		res.render('library/index', {
			_: {
				activePage: 'library',
				title: 'Your Library'
			},
			collection: results.collection,
			child_collections: results.child_collections,
			child_items: results.child_items,
			breadcrumbs: results.breadcrumbs
		});
	});
});

module.exports = router;