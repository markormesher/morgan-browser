var Mongoose = require('mongoose');
var Schema = require('mongoose/lib/schema');
var Async = require('async');

var exp = {

	// model

	Model: Mongoose.model(
		'Item',
		{
			collection_id: {
				type: Schema.Types.ObjectId,
				ref: 'Collection'
			},
			sequence: Number,
			title: String,
			file: String,
			meta: {
				type: Object,
				default: {}
			}
		}
	),

	// managers

	get: function(inputQuery, callback) {
		// build query using waterfall method, then execute at the end
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

				// add collection ID to the query
				function (query, c) {
					if (inputQuery.hasOwnProperty('collection_id')) {
						query.collection_id = inputQuery.collection_id;
					}
					c(null, query);
				},

				// run the query
				function (query, c) {
					exp.Model.find(query).sort([['sequence', 1], ['title', 1]]).exec(function(err, items) {
						if (err) return c('error');

						// parse result if necessary
						var result = items;
						if (inputQuery.hasOwnProperty('single') && inputQuery.single) {
							result = result.length ? result[0] : null;
						}

						callback(null, result);
					});
				}
			],
			function errorCallback() {
				callback('Could not load item(s)')
			}
		);
	},

	// constants

	PRIVATE_META: ['cover_image']

};

module.exports = exp;