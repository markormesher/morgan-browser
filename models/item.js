var mongoose = require('mongoose');
var Schema = require('mongoose/lib/schema');

module.exports = {

	Model: mongoose.model(
		'Item',
		{
			collection_id: {
				type: Schema.Types.ObjectId,
				ref: 'Collection'
			},
			sequence: Number,
			title: String
		}
	),

	get: function(id, callback) {
		this.Model.find({_id: id}, function(err, result) {
			callback(err || result.length != 1 ? null : result[0]);
		});
	}

};
