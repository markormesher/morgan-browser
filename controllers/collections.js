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

router.get('/edit/:id?', function(req, res) {
	// collection id
	var id = req.params.id;
	var creatingNew = id == undefined || id == null;

	Async.parallel(
		{
			collection: function (c) {
				// creating something new
				if (creatingNew) return c(null, null);

				// editing an existing collection
				Collection.get({id: id, $single: true}, function(err, collection) {
					if (err || !collection) {
						return c('not found');
					}

					c(null, collection);
				});
			},
			parentOptions: function (c) {
				Collection.getAllAsTree(function(err, collectionTree) {
					if (err) return c(err);

					// parse to output
					var output = [{value: null, label: 'ROOT'}];
					var parseOutput = function(rootArray, prefix) {
						rootArray.forEach(function (collection) {
							// add this node
							output.push({
								value: collection._id,
								label: prefix + collection.title,
								disabled: collection._id == id
							});

							// add children
							if (collection.$children.length > 0) {
								parseOutput(
									collection.$children,
									prefix + collection.title + '&nbsp;&nbsp;&raquo;&nbsp;&nbsp;'
								);
							}
						});
					};
					parseOutput(collectionTree, '');

					c(null, output);
				});
			}
		},
		function (err, results) {
			if (err) {
				req.flash('error', 'Could not load collection');
				res.writeHead(302, {Location: '/collections'});
				return res.end();
			}

			res.render('collections/edit', {
				_: {
					activePage: 'library',
					title: creatingNew ? 'Create Collection' : 'Edit Collection'
				},
				collection: results.collection,
				parentOptions: results.parentOptions
			});
		}
	);
});

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

		res.writeHead(302, {Location: '/collections'});
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
				res.writeHead(302, {Location: '/collections'})
			} else {
				req.flash('error', 'Collections could not be loaded!');
				res.writeHead(302, {Location: '/'})
			}
			return res.end();
		}

		// render collections
		res.render('collections/index', {
			_: {
				activePage: 'collections',
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