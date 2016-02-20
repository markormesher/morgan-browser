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

				// add parent ID to the query
				function (query, c) {
					if (inputQuery.hasOwnProperty('parent_id')) {
						query.parent_id = inputQuery.parent_id;
					}
					c(null, query);
				},

				// run the query
				function (query, c) {
					exp.Model.find(query).sort([['title', 1]]).exec(function(err, collections) {
						if (err) return c('error');

						// parse result if necessary
						var result = collections;
						if (inputQuery.hasOwnProperty('$single') && inputQuery.$single) {
							result = result.length ? result[0] : null;
						}

						callback(null, result);
					});
				}
			],
			function errorCallback() {
				callback('Could not load collection(s)')
			}
		);
	}

};

module.exports = exp;