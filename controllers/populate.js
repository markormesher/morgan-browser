// dependencies

var express = require('express'),
	rfr = require('rfr'),
	mongoose = require('mongoose'),
	async = require('async');

// models

var Collection = rfr('./models/collection'),
	Item = rfr('./models/item');

// routes

var router = express.Router();

router.get('/', function (req, res) {
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
		{_id: ids[2], parent_id: ids[1], title: 'Chuck', meta: {cover_image: 'chuck_collection_cover.png'}},
		{_id: ids[3], parent_id: ids[1], title: 'Supernatural', meta: {cover_image: 'supernatural_collection_cover.png'}},
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
		{_id: ids[16], collection_id: ids[0], sequence: 0, title: 'It Follows', meta: {year: '2015'}},
		{_id: ids[17], collection_id: ids[0], sequence: 0, title: 'Yes Man', meta: {year: '2015'}},
		{_id: ids[18], collection_id: ids[0], sequence: 0, title: 'Hot Fuzz', meta: {year: '2015'}},
		{_id: ids[19], collection_id: ids[0], sequence: 0, title: 'Deadpool', meta: {year: '2015'}},
		{_id: ids[20], collection_id: ids[0], sequence: 0, title: 'Shaun of the Dead', meta: {year: '2015'}},

		{_id: ids[13], collection_id: ids[8], sequence: 1, title: 'Chuck vs. The Intersect', file: '/home/markormesher/test.avi'},
		{_id: ids[14], collection_id: ids[8], sequence: 2, title: 'Chuck vs. The Helicopter'},
		{_id: ids[15], collection_id: ids[8], sequence: 3, title: 'Chuck vs. The Tango'}
	];

	async.series([
		function (c) {
			Collection.Model.remove({}, function (err) {
				c(err, 0)
			});
		},
		function (c) {
			Item.Model.remove({}, function (err) {
				c(err, 0)
			});
		},
		function (c) {
			Collection.Model.insertMany(collections, function (err) {
				c(err, 0);
			});
		},
		function (c) {
			Item.Model.insertMany(items, function (err) {
				c(err, 0);
			});
		}
	], function (err) {
		if (err) return res.json(err);
		req.flash('success', 'Done');
		res.writeHead(301, {Location: '/'});
		res.end();
	});
});

module.exports = router;