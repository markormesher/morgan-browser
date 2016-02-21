var Mongoose = require('mongoose');
var Async = require('async');

var exp = {

	// model

	Model: Mongoose.model(
		'Config',
		{
			key: String,
			value: String
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
				}
			],
			callback
		);
	},

	get: function(inputQuery, callback) {
		exp.$buildQuery(inputQuery, function(err, query) {
			if (err || !query) return callback('Could not parse query');

			exp.Model.find(query).exec(function(err, configs) {
				if (err) return callback('error');

				// parse result if necessary
				var result;
				if (inputQuery.hasOwnProperty('$single') && inputQuery.$single) {
					result = configs.length ? configs[0] : null;
				} else {
					result = {};
					for (var i in configs) {
						result[i] = configs[i];
					}
				}

				callback(null, result);
			});
		});
	},

	createOrUpdate: function(id, newConfig, callback) {
		// creating a new config, or updating an existing one?
		var createNew = false;
		if (!id || id == '0') {
			id = Mongoose.Types.ObjectId();
			createNew = true;
		}

		exp.Model.update({_id: id}, newConfig, {upsert: true}, function (err) {
			callback(err, id, createNew);
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