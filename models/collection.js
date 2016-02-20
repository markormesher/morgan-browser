var Mongoose = require('mongoose');
var Schema = require('mongoose/lib/schema');
var Async = require('async');

var exp = {

	// model

	Model: Mongoose.model(
		'Collection',
		{
			parent_id: {
				type: Schema.Types.ObjectId,
				ref: 'Collection'
			},
			title: String,
			meta: {
				type: Object,
				default: {}
			}
		}
	),

	// manager

	$buildQuery: function(inputQuery, callback) {
		// build query using waterfall method, then execute the callback at the end
		Async.waterfall(
			[
				// start with the default query
				function (c) {
					c(null, {});
				},

				// add ID to the query
				function (query, c) {
					if (inputQuery.hasOwnProperty('id') && inputQuery.id) {
						query._id = inputQuery.id;
					}
					c(null, query);
				},

				// add parent ID to the query
				function (query, c) {
					if (inputQuery.hasOwnProperty('parent_id')) {
						query.parent_id = inputQuery.parent_id;
					}
					c(null, query);
				}
			],
			callback
		);
	},

	get: function(inputQuery, callback) {
		exp.$buildQuery(inputQuery, function(err, query) {
			if (err || !query) return callback('Could not parse query');

			exp.Model.find(query).sort([['title', 1]]).exec(function(err, collections) {
				if (err) return callback('error');

				// parse result if necessary
				var result = collections;
				if (inputQuery.hasOwnProperty('$single') && inputQuery.$single) {
					result = result.length ? result[0] : null;
				}

				callback(null, result);
			});
		});
	},

	// WARNING: This function is inefficient, but it is not called during normal use.
	//          It is only used for editing and maintenance.
	getAllAsTree: function(callback) {
		// get all collections
		exp.get({}, function(err, allCollections) {
			if (err) return callback(err);

			// convert all to objects
			allCollections = allCollections.map(function (c) {
				c = c.toObject();
				c._id = c._id.toString();
				return c;
			});

			var output = [];
			var usedIds = [];

			// adds the children of a node to it
			var addChildren = function(collection) {
				collection.$children = [];
				allCollections.forEach(function (c) {
					// skip already assigned nodes
					if (usedIds.indexOf(c._id) >= 0) return;

					// append to parent
					if (c.parent_id == collection._id) {
						c = addChildren(c);
						collection.$children.push(c);
						usedIds.push(c._id);
					}
				});
				return collection;
			};

			// start at root nodes
			allCollections.forEach(function(c) {
				if (!c.parent_id) {
					c = addChildren(c);
					output.push(c);
					usedIds.push(c._id);
				}
			});

			callback(null, output);
		});
	},

	remove: function(inputQuery, callback) {
		exp.$buildQuery(inputQuery, function(err, query) {
			if (err || !query) return callback('Could not parse query');

			exp.Model.find(query).remove(callback);
		});
	}

};

module.exports = exp;