var mongoose = require('mongoose'),
	Schema = require('mongoose/lib/schema');

module.exports = {

	Model: mongoose.model(
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

	get: function(id, callback) {
		// get item
		this.Model.find({_id: id}, function(err, item) {
			if (err || item.length != 1) return callback(null);
			callback(item[0]);
		});
	},

	// constants

	PRIVATE_META: ['cover_image']

};
