var mongoose = require('mongoose'),
	Schema = require('mongoose/lib/schema'),
	rfr = require('rfr');

module.exports = {

	Model: mongoose.model(
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

	get: function (id, callback) {
		// get collection
		this.Model.find({_id: id}, function (err, collection) {
			if (err || collection.length != 1) return callback(null);
			callback(collection[0]);
		});
	}

};
