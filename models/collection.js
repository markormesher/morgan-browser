var Mongoose = require('mongoose');
var Schema = require('mongoose/lib/schema');

module.exports = {

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

	get: function (id, callback) {
		// get collection
		this.Model.find({_id: id}, function (err, collection) {
			if (err || collection.length != 1) return callback(null);
			callback(collection[0]);
		});
	}

};
