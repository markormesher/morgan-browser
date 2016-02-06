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

router.get('/populate', function (req, res) {
	var ids = [
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId(),
		mongoose.Types.ObjectId()
	];

	var collections = [
		// root collections
		{_id: ids[0], parent_id: null, title: 'Films'},
		{_id: ids[1], parent_id: null, title: 'TV'},

		// shows
		{_id: ids[2], parent_id: ids[1], title: 'Chuck'},
		{_id: ids[3], parent_id: ids[1], title: 'Supernatural'},
		{_id: ids[4], parent_id: ids[1], title: 'Scrubs'},
		{_id: ids[5], parent_id: ids[1], title: 'Hustle'},
		{_id: ids[6], parent_id: ids[1], title: 'Dexter'},
		{_id: ids[7], parent_id: ids[1], title: 'Warehouse 13'},

		// chuck seasons
		{_id: ids[8], parent_id: ids[2], title: 'Season 1'},
		{_id: ids[9], parent_id: ids[2], title: 'Season 2'},
		{_id: ids[10], parent_id: ids[2], title: 'Season 3'},
		{_id: ids[11], parent_id: ids[2], title: 'Season 4'},
		{_id: ids[12], parent_id: ids[2], title: 'Season 5'}
	];

	var items = [
		{_id: ids[13], collection_id: ids[8], sequence: 1, title: 'Chuck vs. The Intersect'},
		{_id: ids[14], collection_id: ids[8], sequence: 2, title: 'Chuck vs. The Helicopter'},
		{_id: ids[15], collection_id: ids[8], sequence: 3, title: 'Chuck vs. The Tango'}
	];

	// remove all collections
	Collection.remove({}, function (err) {
		if (err) return res.json(err);

		// remove all items
		Item.remove({}, function (err) {
			if (err) return res.json(err);

			// insert new collections
			Collection.insertMany(collections, function (err, c) {
				if (err) return res.json(err);

				console.log(c);

				// insert new items
				Item.insertMany(items, function (err, i) {
					if (err) return res.json(err);

					console.log(i);

					res.writeHead(301, {Location: '/collections'});
					res.end();
				});
			});
		});
	});
});

router.get('/:id?', function (req, res) {
	// collection id
	var id = req.params.id;

	// async tasks
	async.parallel({

		// get the collection "in focus"
		collection: function (c) {
			if (id == null) return c(null, null);
			Collection.find({_id: id}, function (err, result) {
				if (err) return c(err, null);
				if (result.length != 1) return c('no collection', null);
				c(null, result);
			});
		},

		// get child collections
		child_collections: function (c) {
			Collection.find({parent_id: id}).sort({title: 'asc'}).exec(function (err, result) {
				c(err, result);
			});
		},

		// get child items
		child_items: function (c) {
			Item.find({collection_id: id}).sort({sequence: 'asc'}).exec(function (err, result) {
				c(err, result);
			});
		},

		// get collection breadcrumbs
		breadcrumbs: function(c) {
			c(null, []);
		}

	}, function (err, results) {
		// check errors
		if (err) console.log(err);
		if (err == 'no collection') {
			return helpers.errorRedirect(req, res, '/', 'Could not load collection');
		} else if (err) {
			// TODO: fix this
			return helpers.errorRedirect(req, res, '/', 'Could not load something');
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
})
;

module.exports = router;